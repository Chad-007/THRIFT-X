import http from "k6/http";
import { sleep } from "k6";

export default function () {
  const url = "http://152.42.158.2/api/login";
  const payload = JSON.stringify({
    username: "Alex",
    password: "1234",
  });

  const params = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  http.post(url, payload, params);
  sleep(1);
}
