import Topic from './model/Topic';
import Passage, { SentenceItem } from './model/Passage';

function buildSentences(
  items: Array<{ text: string; translation: string }>,
): SentenceItem[] {
  return items.map((item, idx) => {
    const words = item.text
      .trim()
      .split(/\s+/)
      .filter((w) => w.length > 0);
    return {
      order: idx + 1,
      text: item.text,
      translation: item.translation,
      word_count: words.length,
    };
  });
}

function createPassage(
  input: Omit<Passage, 'sentences' | 'total_words' | 'is_published'> & {
    rawSentences: Array<{ text: string; translation: string }>;
  },
): Passage {
  const sentences = buildSentences(input.rawSentences);
  const totalWords = sentences.reduce((sum, s) => sum + s.word_count, 0);
  return {
    id: input.id,
    topic_id: input.topic_id,
    title: input.title,
    level: input.level,
    default_wpm: input.default_wpm,
    description: input.description,
    sentences,
    total_words: totalWords,
    is_published: true,
  };
}

export const SEED_TOPICS: Topic[] = [
  {
    id: 'daily_life',
    title: 'Daily Conversation',
    title_vi: 'Giao tiếp hàng ngày',
    description:
      'Natural conversations for everyday routines, shopping, and socializing.',
    icon: 'coffee',
    order: 1,
    passage_count: 2,
    is_active: true,
  },
  {
    id: 'travel',
    title: 'Travel & Explore',
    title_vi: 'Du lịch & Khám phá',
    description:
      'Essential phrases and stories for airports, hotels, and exploring new cities.',
    icon: 'flight',
    order: 2,
    passage_count: 2,
    is_active: true,
  },
  {
    id: 'work_career',
    title: 'Work & Career',
    title_vi: 'Công sở & Sự nghiệp',
    description:
      'Professional communication for meetings, standups, and interviews.',
    icon: 'work',
    order: 3,
    passage_count: 2,
    is_active: true,
  },
  {
    id: 'technology',
    title: 'Tech & Innovation',
    title_vi: 'Công nghệ & Đổi mới',
    description:
      'Discussions on modern software, artificial intelligence, and digital life.',
    icon: 'memory',
    order: 4,
    passage_count: 1,
    is_active: true,
  },
  {
    id: 'health_mindset',
    title: 'Mindset & Habits',
    title_vi: 'Tư duy & Thói quen',
    description:
      'Inspiring passages on mindfulness, productivity, and personal growth.',
    icon: 'self_improvement',
    order: 5,
    passage_count: 1,
    is_active: true,
  },
];

export const SEED_PASSAGES: Passage[] = [
  createPassage({
    id: 'pas_coffee_01',
    topic_id: 'daily_life',
    title: 'Ordering Morning Coffee',
    level: 'A1',
    default_wpm: 105,
    description:
      'A friendly exchange at a neighborhood cafe on a busy morning.',
    rawSentences: [
      {
        text: 'Good morning, could I get a medium iced latte with oat milk, please?',
        translation:
          'Chào buổi sáng, cho tôi một ly latte đá cỡ vừa với sữa yến mạch nhé?',
      },
      {
        text: 'Would you like any sweetener or vanilla syrup in your coffee today?',
        translation:
          'Hôm nay bạn có muốn thêm đường hay si-rô va-ni vào cà phê không?',
      },
      {
        text: 'Just a little bit of cinnamon on top is perfect, thank you.',
        translation:
          'Chỉ cần rắc một chút bột quế lên trên là tuyệt rồi, cảm ơn bạn.',
      },
      {
        text: 'I will also take a warm almond croissant to go.',
        translation:
          'Tôi cũng lấy thêm một chiếc bánh sừng bò hạnh nhân ấm mang đi nhé.',
      },
      {
        text: 'Your order will be ready at the counter in just two minutes.',
        translation:
          'Đồ của bạn sẽ sẵn sàng ở quầy chỉ sau hai phút nữa.',
      },
    ],
  }),
  createPassage({
    id: 'pas_weekend_02',
    topic_id: 'daily_life',
    title: 'Catching Up on the Weekend',
    level: 'A2',
    default_wpm: 120,
    description: 'Two friends talking about their relaxing weekend plans.',
    rawSentences: [
      {
        text: 'It has been such a long week, and I am ready to unwind.',
        translation: 'Tuần vừa rồi thật dài, và tôi đã sẵn sàng để thư giãn.',
      },
      {
        text: 'Tomorrow morning, I plan to wake up early and jog around the lake.',
        translation: 'Sáng mai, tôi dự định thức dậy sớm và chạy bộ quanh hồ.',
      },
      {
        text: 'Afterward, we are meeting at the farmers market to buy fresh fruit.',
        translation:
          'Sau đó, chúng tôi sẽ gặp nhau ở chợ nông sản để mua trái cây tươi.',
      },
      {
        text: 'In the evening, cooking dinner at home with good music sounds wonderful.',
        translation:
          'Vào buổi tối, nấu bữa tối tại nhà cùng âm nhạc hay nghe thật tuyệt vời.',
      },
    ],
  }),
  createPassage({
    id: 'pas_airport_01',
    topic_id: 'travel',
    title: 'Navigating the International Airport',
    level: 'A2',
    default_wpm: 115,
    description:
      'Checking in for an international flight and finding the boarding gate.',
    rawSentences: [
      {
        text: 'Here is my passport and boarding pass for the flight to Tokyo.',
        translation:
          'Đây là hộ chiếu và thẻ lên máy bay của tôi cho chuyến bay đi Tokyo.',
      },
      {
        text: 'Could you please assign me a window seat near the front of the cabin?',
        translation:
          'Bạn có thể xếp cho tôi một chỗ ngồi cạnh cửa sổ gần phía đầu khoang được không?',
      },
      {
        text: 'I only have one carry-on backpack and no checked luggage today.',
        translation:
          'Hôm nay tôi chỉ có một ba lô xách tay và không có hành lý ký gửi.',
      },
      {
        text: 'Boarding begins at gate twenty-four in forty-five minutes, so enjoy your trip.',
        translation:
          'Giờ lên máy bay bắt đầu tại cổng 24 sau 45 phút nữa, chúc bạn có chuyến đi vui vẻ.',
      },
    ],
  }),
  createPassage({
    id: 'pas_kyoto_02',
    topic_id: 'travel',
    title: 'An Evening Walk in Kyoto',
    level: 'B1',
    default_wpm: 125,
    description: 'Experiencing the quiet charm of historic streets at dusk.',
    rawSentences: [
      {
        text: 'As the sun sets behind the mountains, wooden lanterns begin to glow along the narrow alley.',
        translation:
          'Khi mặt trời lặn sau rặng núi, những chiếc đèn lồng gỗ bắt đầu tỏa sáng dọc con hẻm nhỏ.',
      },
      {
        text: 'The sound of footsteps on wet cobblestones creates a calm and timeless atmosphere.',
        translation:
          'Tiếng bước chân trên mặt đá cuội ướt tạo nên một bầu không khí yên bình và vượt thời gian.',
      },
      {
        text: 'Small teahouses welcome travelers with the warm aroma of roasted green tea.',
        translation:
          'Những quán trà nhỏ chào đón du khách bằng hương thơm ấm áp của trà xanh rang.',
      },
      {
        text: 'Traveling slowly allows you to notice details that hurried tourists often miss.',
        translation:
          'Đi du lịch chậm rãi giúp bạn nhận ra những chi tiết mà du khách vội vã thường bỏ lỡ.',
      },
    ],
  }),
  createPassage({
    id: 'pas_standup_01',
    topic_id: 'work_career',
    title: 'Daily Agile Standup Update',
    level: 'B1',
    default_wpm: 130,
    description:
      'Sharing clear and concise progress during an engineering team standup.',
    rawSentences: [
      {
        text: 'Yesterday, I finished integrating the payment gateway and wrote unit tests for checkout.',
        translation:
          'Hôm qua, tôi đã hoàn thành tích hợp cổng thanh toán và viết unit test cho luồng thanh toán.',
      },
      {
        text: 'Today, my main focus is optimizing the loading speed of the mobile dashboard.',
        translation:
          'Hôm nay, trọng tâm chính của tôi là tối ưu tốc độ tải của bảng điều khiển trên di động.',
      },
      {
        text: 'I am currently waiting for the updated API documentation from the backend team.',
        translation:
          'Hiện tại tôi đang chờ tài liệu API cập nhật từ đội ngũ backend.',
      },
      {
        text: 'Let us sync briefly after this meeting so we can unblock the deployment pipeline.',
        translation:
          'Hãy trao đổi ngắn sau cuộc họp này để chúng ta có thể tháo gỡ vướng mắc cho luồng triển khai.',
      },
    ],
  }),
  createPassage({
    id: 'pas_leadership_02',
    topic_id: 'work_career',
    title: 'Communicating with Clarity',
    level: 'B2',
    default_wpm: 140,
    description:
      'How effective leaders articulate vision and feedback in modern teams.',
    rawSentences: [
      {
        text: 'Clear communication is not just about speaking well, but also about listening with genuine curiosity.',
        translation:
          'Giao tiếp rõ ràng không chỉ là nói hay, mà còn là lắng nghe với sự quan tâm chân thành.',
      },
      {
        text: 'When expectations are transparent from the start, teams can make autonomous decisions with confidence.',
        translation:
          'Khi kỳ vọng được minh bạch ngay từ đầu, các nhóm có thể tự chủ đưa ra quyết định một cách tự tin.',
      },
      {
        text: 'Constructive feedback works best when it focuses on specific actions rather than personal traits.',
        translation:
          'Phản hồi mang tính xây dựng hiệu quả nhất khi tập trung vào hành động cụ thể thay vì tính cách cá nhân.',
      },
      {
        text: 'Ultimately, trust is built through consistent follow-through on even the smallest commitments.',
        translation:
          'Sau cùng, niềm tin được xây dựng thông qua việc thực hiện nhất quán ngay cả những cam kết nhỏ nhất.',
      },
    ],
  }),
  createPassage({
    id: 'pas_ai_future_01',
    topic_id: 'technology',
    title: 'Human Creativity in the Age of AI',
    level: 'C1',
    default_wpm: 145,
    description:
      'Exploring how intelligent tools amplify human judgment and design.',
    rawSentences: [
      {
        text: 'Artificial intelligence is rapidly transforming how we write code, analyze data, and prototype new ideas.',
        translation:
          'Trí tuệ nhân tạo đang nhanh chóng thay đổi cách chúng ta viết mã, phân tích dữ liệu và thử nghiệm ý tưởng mới.',
      },
      {
        text: 'However, the most impactful products still rely on human empathy and deep domain understanding.',
        translation:
          'Tuy nhiên, những sản phẩm có sức ảnh hưởng lớn nhất vẫn dựa vào sự thấu cảm của con người và hiểu biết chuyên sâu.',
      },
      {
        text: 'By automating repetitive tasks, engineers can dedicate more energy to architecture and user experience.',
        translation:
          'Bằng cách tự động hóa các tác vụ lặp lại, kỹ sư có thể dành nhiều năng lượng hơn cho kiến trúc và trải nghiệm người dùng.',
      },
      {
        text: 'The future belongs to builders who combine technical precision with creative storytelling.',
        translation:
          'Tương lai thuộc về những người kiến tạo biết kết hợp độ chính xác kỹ thuật với nghệ thuật kể chuyện sáng tạo.',
      },
    ],
  }),
  createPassage({
    id: 'pas_habits_01',
    topic_id: 'health_mindset',
    title: 'The Power of Small Daily Habits',
    level: 'B1',
    default_wpm: 120,
    description:
      'Why fifteen minutes of focused practice every day beats occasional marathons.',
    rawSentences: [
      {
        text: 'Improving your spoken fluency does not require hours of exhausting study every single night.',
        translation:
          'Cải thiện sự trôi chảy khi nói không đòi hỏi hàng giờ học tập mệt mỏi mỗi tối.',
      },
      {
        text: 'Ten minutes of focused shadowing each morning trains your ear and vocal muscles naturally.',
        translation:
          'Mười phút luyện đọc đuổi tập trung mỗi sáng giúp rèn luyện tai nghe và cơ phát âm một cách tự nhiên.',
      },
      {
        text: 'Consistency compounds quietly over weeks until speaking feels effortless and automatic.',
        translation:
          'Sự kiên trì tích lũy âm thầm qua từng tuần cho đến khi việc nói trở nên nhẹ nhàng và tự nhiên như phản xạ.',
      },
      {
        text: 'Focus on rhythm and intonation today, and celebrate every small step forward.',
        translation:
          'Hãy tập trung vào nhịp điệu và ngữ điệu ngay hôm nay, và trân trọng từng bước tiến nhỏ.',
      },
    ],
  }),
];
