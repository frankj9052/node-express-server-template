import argon2 from 'argon2';

async function run() {
  const hash = await argon2.hash('test123');
  const match = await argon2.verify(hash, 'test123');
  console.log('Hash:', hash);
  console.log('Match:', match);
}
run();
