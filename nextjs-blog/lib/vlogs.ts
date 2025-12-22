export interface VlogData {
  id: string;
  title: string;
  description: string;
  date: string;
  youtubeId: string;
}

export const vlogsData: VlogData[] = [
  {
    id: '1',
    title: 'Training for sub 2:40 on the Canova Method',
    description: `Renato Canova is a legendary Italian running coach. He's had over 50 athletes medal in the Olympics or World Championships in his career.
More recently he coached Emile Cairess to a 2:06 at the London Marathon in 2024 and also coached Sondre Moen to break the European Marathon Record to run 2:05 in 2017.

This week I'm adopting the Canova Method in my training to break 2:40 at the Mesa Marathon. My workouts focus on building race specific endurance by running a lot of goal Marathon pace with fast floats. Will this method take me to the promised land like it did for Alex Yee in Valencia? Or will it end in a blow up and send me back to my old ways of lighter training?`,
    date: '2025-12-21',
    youtubeId: '10fmd5rP_xs'
  },
  {
    id: '2',
    title: 'Build Up or Blow Up: The Wrong Way to Train for a Marathon?',
    description: 'Time for another race effort.Follow the journey as I race 8 races in 12 weeks during my build to the Mesa Marathon. Will my race efforts result in me hitting a wall? Or will my strategy pay dividends for 26.2?',
    date: '2025-12-17',
    youtubeId: 'x46Y6Kw-vgY' // Replace with your actual YouTube video ID
  },
  {
    id: '3',
    title: '8 Races, 12 Weeks: How I Cram Fitness Between Contests',
    description: 'One week until the race and it\'s cram fitness or die. Check in on my build to the Mesa Marathon as I races 8 times in 12 weeks. Will I run under 2:40? Would a downhill course even count? Can I handle the pressure? We\'ll soon find out',
    date: '2025-12-06',
    youtubeId: 'wZKTt5Sn3q4'
  },
  {
    id: '4',
    title: 'Midwestern Nice: 69.9 Mile Week in Marathon Training. Getting it Done in a Winter Storm.',
    description: 'We\'re Going Long in 35 MPH Winds under 20 degrees F! Follow along on my Long Run on the other side of a major midwestern winter storm. On the weekend after thanksgiving, I meet my training parters in the famous Forest Park in Saint Louis to get my 16 mile long run done.',
    date: '2025-12-01',
    youtubeId: 'mxFByzsQPnY'
  },
  {
    id: '5',
    title: 'Training in Saint Louis Winter: 8 Races in 12 Weeks.',
    description: 'Danny is embarking on a challenge to race 8 times in his build to the Mesa Marathon. Join the fun as Danny vlogs his journey with his training partners. Will he hit a wall getting sick or injured? Or will he reach new heights in his running career?',
    date: '2025-11-30',
    youtubeId: 'Jf1rIPWXQPo'
  }
];

export function getSortedVlogsData() {
  return vlogsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

export function getVlogData(id: string): VlogData | undefined {
  return vlogsData.find(vlog => vlog.id === id);
}
