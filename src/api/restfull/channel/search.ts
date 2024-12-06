import ApiConsts from "../../../constants/ApiConsts";

export default function SearchChannelAPI(dataSearch: string) {
  return fetch(`${ApiConsts.BASE_URL}/channels?name=${dataSearch}`)
    .then((res) => res.json())
    .then((data) => data)
    .catch((err) => console.error(err))
}