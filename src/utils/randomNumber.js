import aleaRNGFactory from "number-generator/lib/aleaRNGFactory.js";

export default function randomNumber() {
  const generateRandomNumber = aleaRNGFactory(Date.now());
  const finalGenerateRandomNumber = generateRandomNumber
    .uInt32()
    .toString()
    .substring(0, 4);
  return finalGenerateRandomNumber;
}
