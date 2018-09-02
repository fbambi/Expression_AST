
import parse from './lib/parse'

export default (exps) => {


  try {
    
    console.time('ast')
    const result = parse(exps)
    console.timeEnd('ast')
    return result

  } catch (error) {
    console.log(error)
    return error
  }







}


