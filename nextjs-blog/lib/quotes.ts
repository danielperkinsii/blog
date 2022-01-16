import jsonQuotes from '../public/quotes.json'

export default function randomQuote() {
    const quotes: any = jsonQuotes
    const keys: string[] = Object.keys(quotes)
    const randomKeyIndex: number = Math.floor((Math.random()*10)%keys.length)
    const author: string = keys[randomKeyIndex]
    // tslint:disable-next-line
    const quotesArr: string[] = quotes[author]
    const randomIndex: number = Math.floor((Math.random()*10)%quotesArr.length)
    const randomQuote: string = quotesArr[randomIndex]
    return `"${randomQuote}" \n-${author}`
}