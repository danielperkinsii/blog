import quotes from '../public/quotes.json'

export default function randomQuote() {
    const keys = Object.keys(quotes)
    const randomKeyIndex = Math.floor((Math.random()*10)%keys.length)
    const author = keys[randomKeyIndex]
    const quotesArr = quotes[author]
    const randomIndex = Math.floor((Math.random()*10)%quotesArr.length)
    const randomQuote = quotesArr[randomIndex]
    return `"${randomQuote}" \n-${author}`
}