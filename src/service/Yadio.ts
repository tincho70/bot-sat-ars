import axios from 'axios'
import { ApiYadio } from './Yadio.d'

const convert = async (
  amount: number,
  from: string,
  to: string
): Promise<ApiYadio | undefined> => {
  try {
    const { data } = await axios.get(
      `https://api.yadio.io/convert/${amount}/${from}/${to}`,
      {
        headers: {
          Accept: 'application/json',
        },
      }
    )
    return data as ApiYadio
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('AXIOS ERROR', error.cause)
    } else {
      console.error('UNEXPECTED ERROR', error)
    }
    return undefined
  }
}

export default convert
