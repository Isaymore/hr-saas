// 格式化日期时间
export const formDate = (str) => {
  const time = new Date(str)
  const year = time.getFullYear()
  let month = time.getMonth() + 1
  let date = time.getDate()
  month = month < 10 ? ('0' + month) : month
  date = date < 10 ? ('0' + date) : date
  return `${year}/${month}/${date}`
}
