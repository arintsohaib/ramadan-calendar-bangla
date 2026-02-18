import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const ramadanData = [
    // রহমতের ১০ দিন (Mercy)
    { dayNumber: 1, phase: 'রহমত', ramadan: '০১ রমজান', gregorian: '১৯ ফেব্রুয়ারি', day: 'বৃহস্পতিবার', sehri: '০৫:১৫', iftar: '০৬:০৪' },
    { dayNumber: 2, phase: 'রহমত', ramadan: '০২ রমজান', gregorian: '২০ ফেব্রুয়ারি', day: 'শুক্রবার', sehri: '০৫:১৪', iftar: '০৬:০৫' },
    { dayNumber: 3, phase: 'রহমত', ramadan: '০৩ রমজান', gregorian: '২১ ফেব্রুয়ারি', day: 'শনিবার', sehri: '০৫:১৩', iftar: '০৬:০৫' },
    { dayNumber: 4, phase: 'রহমত', ramadan: '০৪ রমজান', gregorian: '২২ ফেব্রুয়ারি', day: 'রবিবার', sehri: '০৫:১৩', iftar: '০৬:০৬' },
    { dayNumber: 5, phase: 'রহমত', ramadan: '০৫ রমজান', gregorian: '২৩ ফেব্রুয়ারি', day: 'সোমবার', sehri: '০৫:১২', iftar: '০৬:০৭' },
    { dayNumber: 6, phase: 'রহমত', ramadan: '০৬ রমজান', gregorian: '২৪ ফেব্রুয়ারি', day: 'মঙ্গলবার', sehri: '০৫:১১', iftar: '০৬:০৭' },
    { dayNumber: 7, phase: 'রহমত', ramadan: '০৭ রমজান', gregorian: '২৫ ফেব্রুয়ারি', day: 'বুধবার', sehri: '০৫:১০', iftar: '০৬:০৮' },
    { dayNumber: 8, phase: 'রহমত', ramadan: '০৮ রমজান', gregorian: '২৬ ফেব্রুয়ারি', day: 'বৃহস্পতিবার', sehri: '০৫:১০', iftar: '০৬:০৮' },
    { dayNumber: 9, phase: 'রহমত', ramadan: '০৯ রমজান', gregorian: '২৭ ফেব্রুয়ারি', day: 'শুক্রবার', sehri: '০৫:০৯', iftar: '০৬:০৯' },
    { dayNumber: 10, phase: 'রহমত', ramadan: '১০ রমজান', gregorian: '২৮ ফেব্রুয়ারি', day: 'শনিবার', sehri: '০৫:০৯', iftar: '০৬:০৯' },

    // মাগফিরাতের ১০ দিন (Forgiveness)
    { dayNumber: 11, phase: 'মাগফিরাত', ramadan: '১১ রমজান', gregorian: '০১ মার্চ', day: 'রবিবার', sehri: '০৫:০৭', iftar: '০৬:১০' },
    { dayNumber: 12, phase: 'মাগফিরাত', ramadan: '১২ রমজান', gregorian: '০২ মার্চ', day: 'সোমবার', sehri: '০৫:০৬', iftar: '০৬:১০' },
    { dayNumber: 13, phase: 'মাগফিরাত', ramadan: '১৩ রমজান', gregorian: '০৩ মার্চ', day: 'মঙ্গলবার', sehri: '০৫:০৫', iftar: '০৬:১১' },
    { dayNumber: 14, phase: 'মাগফিরাত', ramadan: '১৪ রমজান', gregorian: '০৪ মার্চ', day: 'বুধবার', sehri: '০৫:০৪', iftar: '০৬:১১' },
    { dayNumber: 15, phase: 'মাগফিরাত', ramadan: '১৫ রমজান', gregorian: '০৫ মার্চ', day: 'বৃহস্পতিবার', sehri: '০৫:০৩', iftar: '০৬:১২' },
    { dayNumber: 16, phase: 'মাগফিরাত', ramadan: '১৬ রমজান', gregorian: '০৬ মার্চ', day: 'শুক্রবার', sehri: '০৫:০২', iftar: '০৬:১২' },
    { dayNumber: 17, phase: 'মাগফিরাত', ramadan: '১৭ রমজান', gregorian: '০৭ মার্চ', day: 'শনিবার', sehri: '০৫:০১', iftar: '০৬:১৩' },
    { dayNumber: 18, phase: 'মাগফিরাত', ramadan: '১৮ রমজান', gregorian: '০৮ মার্চ', day: 'রবিবার', sehri: '০৫:০০', iftar: '০৬:১৩' },
    { dayNumber: 19, phase: 'মাগফিরাত', ramadan: '১৯ রমজান', gregorian: '০৯ মার্চ', day: 'সোমবার', sehri: '০৪:৫৯', iftar: '০৬:১৪' },
    { dayNumber: 20, phase: 'মাগফিরাত', ramadan: '২০ রমজান', gregorian: '১০ মার্চ', day: 'মঙ্গলবার', sehri: '০৪:৫৮', iftar: '০৬:১৪' },

    // নাজাতের ১০ দিন (Salvation)
    { dayNumber: 21, phase: 'নাজাত', ramadan: '২১ রমজান', gregorian: '১১ মার্চ', day: 'বুধবার', sehri: '০৪:৫৭', iftar: '০৬:১৫' },
    { dayNumber: 22, phase: 'নাজাত', ramadan: '২২ রমজান', gregorian: '১২ মার্চ', day: 'বৃহস্পতিবার', sehri: '০৪:৫৬', iftar: '০৬:১৫' },
    { dayNumber: 23, phase: 'নাজাত', ramadan: '২৩ রমজান', gregorian: '১৩ মার্চ', day: 'শুক্রবার', sehri: '০৪:৫৫', iftar: '০৬:১৬' },
    { dayNumber: 24, phase: 'নাজাত', ramadan: '২৪ রমজান', gregorian: '১৪ মার্চ', day: 'শনিবার', sehri: '০৪:৫৪', iftar: '০৬:১৬' },
    { dayNumber: 25, phase: 'নাজাত', ramadan: '২৫ রমজান', gregorian: '১৫ মার্চ', day: 'রবিবার', sehri: '০৪:৫৩', iftar: '০৬:১৬' },
    { dayNumber: 26, phase: 'নাজাত', ramadan: '২৬ রমজান', gregorian: '১৬ মার্চ', day: 'সোমবার', sehri: '০৪:৫২', iftar: '০৬:১৭' },
    { dayNumber: 27, phase: 'নাজাত', ramadan: '২৭ রমজান', gregorian: '১৭ মার্চ', day: 'মঙ্গলবার', sehri: '০৪:৫১', iftar: '০৬:১৭' },
    { dayNumber: 28, phase: 'নাজাত', ramadan: '২৮ রমজান', gregorian: '১৮ মার্চ', day: 'বুধবার', sehri: '০৪:৫০', iftar: '০৬:১৮' },
    { dayNumber: 29, phase: 'নাজাত', ramadan: '২৯ রমজান', gregorian: '১৯ মার্চ', day: 'বৃহস্পতিবার', sehri: '০৪:৪৯', iftar: '০৬:১৮' },
    { dayNumber: 30, phase: 'নাজাত', ramadan: '৩০ রমজান', gregorian: '২০ মার্চ', day: 'শুক্রবার', sehri: '০৪:৪৮', iftar: '০৬:১৯' }
];

async function main() {
  console.log('Start seeding...');
  await prisma.timing.deleteMany();
  for (const timing of ramadanData) {
    await prisma.timing.create({ data: timing });
  }
  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
