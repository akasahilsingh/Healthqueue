// HealthQueue k6 Load Test
// Usage: k6 run k6-tests/load-test.js
// Docs:  https://k6.io/docs

import http from "k6/http";
import { check, sleep } from "k6";
import { Trend, Rate, Counter } from "k6/metrics";

// CONFIG — change BASE_URL to your Render URL when testing prod
// Run with: k6 run --env BASE_URL=https://your-render-url.onrender.com k6-tests/load-test.js
const BASE_URL = __ENV.BASE_URL || "http://localhost:4000";

// Custom metrics — show up in final report
const responseTime = new Trend("response_time_ms");
const errorRate = new Rate("error_rate");
const requestCount = new Counter("total_requests");

// SCENARIOS — 3 modes in one file
// k6 run --env SCENARIO=smoke  k6-tests/load-test.js
// k6 run --env SCENARIO=load   k6-tests/load-test.js
// k6 run --env SCENARIO=stress k6-tests/load-test.js
const SCENARIO = __ENV.SCENARIO || "smoke";

const smokeOpts = { vus: 1, duration: "30s" };
const loadOpts = { vus: 50, duration: "1m" };
const stressOpts = {
  stages: [
    { duration: "30s", target: 10 },
    { duration: "1m", target: 50 },
    { duration: "1m", target: 100 },
    { duration: "30s", target: 200 },
    { duration: "30s", target: 0 },
  ],
};

function getScenarioOpts() {
  if (SCENARIO === "stress") return { stages: stressOpts.stages };
  if (SCENARIO === "load") return { vus: loadOpts.vus, duration: loadOpts.duration };
  return { vus: smokeOpts.vus, duration: smokeOpts.duration };
}

export const options = {
  ...getScenarioOpts(),
  thresholds: {
    http_req_duration: ["p(95)<500"],  // 95% of requests under 500ms
    http_req_failed: ["rate<0.01"],  // less than 1% errors
    error_rate: ["rate<0.01"],
  },
};

const JSON_HEADERS = { "Content-Type": "application/json" };

// TEST 1 — Health Check
function testHealthCheck() {
  const res = http.get(`${BASE_URL}/api/health`);
  responseTime.add(res.timings.duration);
  requestCount.add(1);
  const ok = check(res, {
    "health: status 200": (r) => r.status === 200,
    "health: under 200ms": (r) => r.timings.duration < 200,
  });
  errorRate.add(ok ? 0 : 1);
}

// TEST 2 — Doctor List (public, no auth needed — most important for numbers)
function testDoctorList() {
  const res = http.get(`${BASE_URL}/api/doctor/list`);
  responseTime.add(res.timings.duration);
  requestCount.add(1);
  const ok = check(res, {
    "doctorList: status 200": (r) => r.status === 200,
    "doctorList: has doctors array": (r) => Array.isArray(r.json("doctors")),
    "doctorList: under 300ms": (r) => r.timings.duration < 300,
    "doctorList: no password field": (r) => {
      const docs = r.json("doctors");
      if (!Array.isArray(docs) || docs.length === 0) return true;
      return !Object.prototype.hasOwnProperty.call(docs[0], "password");
    },
  });
  errorRate.add(ok ? 0 : 1);
}

// TEST 3 — Register then Login
function testAuthFlow() {
  const uniqueEmail = `k6_${__VU}_${__ITER}_${Date.now()}@test.com`;
  const password = "TestPassword123";

  // Register
  const regRes = http.post(
    `${BASE_URL}/api/user/register`,
    JSON.stringify({ name: "k6 Test", email: uniqueEmail, password }),
    { headers: JSON_HEADERS }
  );
  responseTime.add(regRes.timings.duration);
  requestCount.add(1);
  const regOk = check(regRes, {
    "register: status 200": (r) => r.status === 200,
    "register: has token": (r) => !!r.json("token"),
    "register: under 1000ms": (r) => r.timings.duration < 1000,
  });
  errorRate.add(regOk ? 0 : 1);
  if (!regOk) return null;

  sleep(0.8);

  // Login
  const loginRes = http.post(
    `${BASE_URL}/api/user/login`,
    JSON.stringify({ email: uniqueEmail, password }),
    { headers: JSON_HEADERS }
  );
  responseTime.add(loginRes.timings.duration);
  requestCount.add(1);
  const loginOk = check(loginRes, {
    "login: status 200": (r) => r.status === 200,
    "login: has token": (r) => !!r.json("token"),
    "login: under 500ms": (r) => r.timings.duration < 500,
  });
  errorRate.add(loginOk ? 0 : 1);
  return loginRes.json("token");
}

// TEST 4 — Authenticated: Get Profile
function testGetProfile(token) {
  if (!token) return;
  const res = http.get(`${BASE_URL}/api/user/get-profile`, { headers: { token } });
  responseTime.add(res.timings.duration);
  requestCount.add(1);
  const ok = check(res, {
    "profile: status 200": (r) => r.status === 200,
    "profile: no password": (r) => !r.json("user.password"),
    "profile: under 300ms": (r) => r.timings.duration < 300,
  });
  errorRate.add(ok ? 0 : 1);
}

// TEST 5 — Paginated Appointments
function testPaginatedAppointments(token) {
  if (!token) return;
  const res = http.get(`${BASE_URL}/api/user/appointments?page=1&limit=10`, { headers: { token } });
  responseTime.add(res.timings.duration);
  requestCount.add(1);
  const ok = check(res, {
    "appointments: status 200": (r) => r.status === 200,
    "appointments: has pagination": (r) => !!r.json("pagination"),
    "appointments: under 500ms": (r) => r.timings.duration < 500,
  });
  errorRate.add(ok ? 0 : 1);
}

// MAIN — runs once per VU per iteration
export default function () {
  testHealthCheck();
  sleep(0.2);

  testDoctorList();
  sleep(0.2);

  const token = testAuthFlow();
  sleep(0.5);

  testGetProfile(token);
  sleep(0.2);

  testPaginatedAppointments(token);
  sleep(0.2);
}
