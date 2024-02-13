export default function SearchChannelAPI(dataSearch: string) {
  return fetch(`http://localhost:3030/channels?name=${dataSearch}`)
    .then((res) => res.json())
    .then((data) => data)
    .catch((err) => console.error(err))
}