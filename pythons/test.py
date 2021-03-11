import requests

res = requests.post('http://localhost:3000/bookstore/register',params={"a":1})
print(res.json())