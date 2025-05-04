function isPrime(num: number): boolean
{
    if (num <= 1)
    {
        return false;
    }

    if (num == 2)
    {
        return true;
    }

    if (num % 2 == 0)
    {
        return false;
    }

    for (let i = 3; i <= Math.sqrt(num); i += 2)
    {
        if (num % i == 0)
        {
            return false;
        }
    }

    return true;
}

const start: number = 10;
const end: number = 100;

for (let num = start; num <= end; ++num)
{
    if (isPrime(num))
    {
        console.log(num);
    }
}
