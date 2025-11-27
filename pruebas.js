function getRandomSaltRounds(min = 11, max = 15) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Usar saltRounds aleatorio
const saltRounds = getRandomSaltRounds(11, 15); // Entre 11 y 15
console.log(`SaltRounds: ${saltRounds}`);