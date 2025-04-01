export const formatDay = () => {
  const dateNow = new Date();
  return `${dateNow.getFullYear()}-${dateNow.getMonth() + 1 < 9 ? '0' + (dateNow.getMonth() + 1) : dateNow.getMonth() + 1}-${dateNow.getDate() < 10 ? '0' + dateNow.getDate() : dateNow.getDate()}`;
};
