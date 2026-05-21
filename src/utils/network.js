export function isNetworkError(err) {
  if (!err) return false;
  if (!err.response) return true;
  return err.code === 'ERR_NETWORK' || err.message === 'Network Error';
}
