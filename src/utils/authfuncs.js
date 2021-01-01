export function register(proxy, user, cb) {
  fetch(`${proxy}users/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify(user)
  }).then(res => res.json())
    .then(json => {
      if (json.success) {
        cb(json);
      }
    })
}

export function login(proxy, user, cb) {
  fetch(`${proxy}users/login`, {
    method: 'POST',
    headers: {
      'Content-Type': "application/json",
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify(user)
  }).then(res => res.json())
    .then(json => {
      if (json.success) {
        cb(json);
      }
    })
}