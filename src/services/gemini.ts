import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function generateNote(subject: string, chapter: string, group: string, level: string) {
  const prompt = `
    তুমি একজন অভিজ্ঞ শিক্ষক। তোমার কাজ হলো SSC/HSC শিক্ষার্থীদের জন্য একটি পূর্ণাঙ্গ নোট তৈরি করা যা "শুন্য থেকে শিখর" পর্যন্ত নিয়ে যাবে।

    বিষয়: ${subject}
    অধ্যায়: ${chapter}
    বিভাগ: ${group}
    লেভেল: ${level}

    নোট তৈরির নিয়ম:
    ১. ভাষা অত্যন্ত সহজ ও প্রাঞ্জল হতে হবে (বাংলায়)।
    ২. প্রতিটি অধ্যায়ের বেসিক থেকে শুরু করে এডভান্স থিওরি ও ম্যাথ ধাপে ধাপে সাজাবে।
    ৩. যদি লেভেল HSC হয়, তবে প্রয়োজনে SSC-র প্রয়োজনীয় টপিকগুলো সংক্ষেপে ইনজেক্ট করবে যাতে শিক্ষার্থীর বুঝতে সুবিধা হয়।
    ৪. নোটের শেষে নির্দিষ্ট সংখ্যক নয় বরং প্রতিটি টপিক থেকে পর্যাপ্ত পরিমাণে কুইজ (MCQ স্টাইল) এবং গাণিতিক সমস্যার সমাধান (Solved Math Examples) দেবে যাতে শিক্ষার্থীর পূর্ণাঙ্গ প্র্যাকটিস হয়। যতগুলো টপিক আলোচনা করা হয়েছে, প্রতিটি টপিক থেকে প্রয়োজনীয় সংখ্যক প্রশ্ন ও ম্যাথ সলভ অবশ্যই থাকবে।
    ৫. আউটপুট অবশ্যই Markdown ফরম্যাটে হবে যাতে সুন্দরভাবে পড়া যায়। হেডার, বোল্ড টেক্সট, লিস্ট এবং ম্যাথমেটিক্যাল ইকুয়েশন (LaTeX স্টাইল) ব্যবহার করবে।
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: prompt,
    });

    return response.text || "দুঃখিত, নোট তৈরি করা সম্ভব হয়নি। আবার চেষ্টা করুন।";
  } catch (error) {
    console.error("Error generating note:", error);
    throw error;
  }
}
