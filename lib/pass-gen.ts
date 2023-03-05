const specialChar = [
  '@',
  '$',
  '!',
  '#',
  '~',
  '&',
  '(',
  ')',
  '0',
  '3',
  '8',
  '<',
  '|',
]
const punctuations = [
  '@',
  '*',
  '+',
  '-',
  ':',
  '"',
  '/',
  '\\',
  '~',
  '?',
  '[',
  ']',
  '{',
  '}',
  '$',
  '!',
  '#',
  '%',
  '&',
  '(',
  ')',
  '_',
  '<',
  '|',
]

function parseNumberandText(
  userInputinArr: (string | number)[]
): [number[], string[]] {
  let numbers: number[] = []
  let texts: string[] = []
  for (let x of userInputinArr) {
    if (typeof x === 'string') {
      texts.push(x)
    } else {
      numbers.push(parseInt(x.toString()))
    }
  }
  return [numbers, texts]
}

function randomUpperoftext(text: string) {
  let loop = Math.floor(Math.random() * text.length)
  for (let x = 0; x < loop; x++) {
    let index = Math.floor(Math.random() * text.length)
    if (text[index] !== text[index].toUpperCase() && !parseInt(text[index])) {
      text =
        text.substring(0, index) +
        text[index].toUpperCase() +
        text.substring(index + 1)
    }
  }
  return text
}

function randomMergeString(string1, string2) {
  let o = Math.floor(Math.random() * 2)
  if (o == 0) {
    return [string2, string1]
  } else {
    return [string1, string2]
  }
}

function replaceStringAlphabetSpecialChar(final) {
  let alphabets = [
    'a',
    's',
    'i',
    'r',
    'x',
    'q',
    'c',
    'j',
    'o',
    'e',
    'b',
    'k',
    'l',
  ]
  for (let x in final) {
    for (let i = 0; i < final[x].length; i++) {
      if (alphabets.includes(final[x][i])) {
        let o = Math.floor(Math.random() * 2)
        if (o == 0) {
          final[x] =
            final[x].substring(0, i) +
            specialChar[alphabets.indexOf(final[x][i])] +
            final[x].substring(i + 1)
        }
      }
    }
  }
  return final
}

//Flower,Guitar,Rose,Console,Steak,12,25
export function generatePassword(
  userInput: [string, string, string, string, string, number, number],
  iteration: number
) {
  let userInputinArr = userInput

  let parsed = parseNumberandText(userInputinArr)
  const generated: string[] = []
  while (iteration > 0) {
    let indexS1 = Math.floor(Math.random() * parsed[1].length)
    let string1 = parsed[1].splice(indexS1, 1)[0]

    let string2 = parsed[1][Math.floor(Math.random() * parsed[1].length)]
    parsed[1].splice(indexS1, 0, string1)

    let number1 = parsed[0][Math.floor(Math.random() * parsed[0].length)]
    let string1Upper = randomUpperoftext(string1)
    let string2Upper = randomUpperoftext(string2)
    let finalPassword = randomMergeString(string1Upper, string2Upper)
    finalPassword = replaceStringAlphabetSpecialChar(finalPassword)
    let insertIndex = Math.floor(Math.random() * 3)
    finalPassword.splice(insertIndex, 0, number1)
    finalPassword.push(
      punctuations[Math.floor(Math.random() * punctuations.length)]
    )
    while (finalPassword.join('').length < 8) {
      finalPassword.push(
        punctuations[Math.floor(Math.random() * punctuations.length)]
      )
    }
    let finalP = finalPassword.join('')
    let checkU = false
    let checkL = false
    let indexArrL: number[] = []
    let indexArrU: number[] = []
    for (let x in finalP.split('')) {
      if (finalP[x] === finalP[x].toUpperCase()) {
        indexArrU.push(parseInt(x))
        checkU = true
      } else if (finalP[x] === finalP[x].toLowerCase()) {
        indexArrL.push(parseInt(x))
        checkL = true
      }
    }
    if (checkU && checkL) {
      finalP = finalP
    } else if (checkL && !checkU) {
      let indexOfU = indexArrL[Math.floor(Math.random() * indexArrL.length)]
      finalP =
        finalP.substring(0, indexOfU) +
        finalP[indexOfU].toUpperCase() +
        finalP.substring(indexOfU + 1)
    } else if (!checkL && checkU) {
      let indexOfL = indexArrU[Math.floor(Math.random() * indexArrU.length)]
      finalP =
        finalP.substring(0, indexOfL) +
        finalP[indexOfL].toLowerCase() +
        finalP.substring(indexOfL + 1)
    }
    generated.push(finalP)
    iteration--
  }
  return generated
}
