const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const STATE_FILE = path.join(__dirname, 'state.json');
const IMAGES_DIR = path.join(__dirname, 'assets', 'images');

// Telegram Configuration (Using user's verified bot & chat ID)
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8679334185:AAFn_xCgxxgnsm3BEkgRdmms_a8_5jp0vBg';
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '775227600';
const POST_INTERVAL_HOURS = parseInt(process.env.POST_INTERVAL_HOURS || '24', 10);

// Procedural 100% Free AI Beauty Topics & Story Matrix
const TOPIC_LIBRARY = [
  {
    id: 'ice_water_dunk',
    title: 'حيلة وعاء الثلج قبل الميك أب (Depuffing بـ 10 ثوانٍ)',
    badge: '🧊 تريند ثلج الصباح',
    image: 'fact_ice_bowl.jpg',
    generateStory: () => `بنات.. إذا عندك مناسبة الليلة ووجهك منفوخ وتعبان، وقفي فورا وجربي هالحركة! 🧊✨

تريند غطس الوجه بوعاء الثلج (Ice Water Dunk) اللي كاسر التيك توك من هوليوود لكوريا!

شو بيعمل بوجهك بـ 10 ثوانٍ؟
البرودة الشديدة بتعمل صدمة انقباض فوري للأوعية الدموية (Vasoconstriction):
1. بتسحب كل السوائل المحبوسة تحت العين والخدود فبيصغر النفخ فوراً.
2. المسام بتنشد وتبين ممسوحة.
3. لما ترفعي وجهك، الدم النقي بيتدفق للجلد وبيعطيكي حمرة ونضارة طبيعية بدون نقطة بلاشر!

⚠️ تحذير خطير:
أوعك تحطي مكعب الثلج مباشرة ع جلدك! رح يحرق الشعيرات الدموية ويعملك احمرار دائم.
الحل الصح: وعاء مي باردة مع مكعبات ثلج، غطسي وجهك 10 إلى 15 ثانية بس!

جربتيها قبل ميك أب السهرة؟ اكتبي بالتعليقات شو كانت النتيجة! 💬👇

#icewaterfacial #depuffing #مكياج #نضارة_فورية #skincarelebanon #beautytok`
  },
  {
    id: 'hyaluronic_trap',
    title: 'فخ سيروم الهيالورونيك (ليه عم ينشفلك وجهك بالغرف المكيفة؟)',
    badge: '💧 فخ الهيالورونيك أسيد',
    image: 'fact_serum_pipette.jpg',
    generateStory: () => `دفعتي $30 على سيروم ترطيب ولقيتي وجهك عم يشد ويجف أكتر؟ اسمعي هالمقلب! 😱💧

الهيالورونيك أسيد مش مرطب بالمعنى اللي فاكرتيه.. هو "إسفنجة مغناطيسية" بتسحب المي من أي مكان حواليها.

شو الغلطة الكارثية اللي 90% من البنات عم يعملوها؟
بيحطوه ع بشرة ناشفة، وقاعدين بغرفة مكيفة هواها جاف!
بهالحالة الإسفنجة ما رح تلاقي رطوبة بالجو.. فمن وين رح تسحب المي؟
رح تمص آخر قطرة رطوبة من طبقات جلدك الداخلية وتبخرها بالهوا! ❌

✅ الطريقة الصح الوحيدة:
1. رشي وجهك بمي أو تونر خليه مبلول تماماً قبل السيروم.
2. فورا بعده: كريم مرطب يقفل ويحبس الرطوبة جوا!

صدمتك المعلومة؟ احفظي الفيديو وشيريه لرفيقتك اللي سيرومها ما عم يفيدها! 🤍📌

#hyaluronicacid #skincarehacks #سيروم_ترطيب #عناية_بالبشرة #جمالك`
  },
  {
    id: 'butter_skin',
    title: 'تريند الـ Butter Skin الكوري (ودّعي لمعة الزيت والفاونديشن الثقيل)',
    badge: '🧈 تريند الـ Butter Skin',
    image: 'fact_butter_skin.jpg',
    generateStory: () => `موضة الفاونديشن التخين ولمعة الزيت انتهت خلاص! تريند الـ "Butter Skin" هو اللي مسيطر هالسنة 🧈✨

الكوريات بطلوا يعملوا لوك "الدونات المدهنة" (Glazed Donut) لأنها بتعطي مظهر دهني تحت شمسنا وحرنا.
البديل الفيروسي الجديد هو: Butter Skin!

شو هو؟
ملمس مخملي زبداني ناعم، البشرة بتكون مترطبة لدرجة إنها عاكسة للضوء بنعومة بدون أي لمعة زيت مزعجة ولا طبقة فاونديشن تبين مغبرة!

السر؟
1. الاستغناء عن الفاونديشن التخين واعتماد Skin Tint أو واقي شمس مع لون خفيف.
2. تجهيز حاجز البشرة بمرطب غني بالسيراميد قبل الميك أب بدقيقتين.

حبيتي هاللوك ولا بتفضلي المات الصافي؟ شاركينا رأيك! 👇

#butterskin #kbeauty #مكياج_ناعم #نضارة_البشرة #beirutvibes #skintint`
  },
  {
    id: 'foundation_clash',
    title: 'ليه الفاونديشن عم يفرط ويشقق بنص السهرة؟ (تضارب السيليكون)',
    badge: '💄 تفتت الفاونديشن',
    image: 'fact_butter_skin.jpg',
    generateStory: () => `ليه فاونديشنك عم يفرط ويخطط ويشقق بنص السهرة؟ السبب مش نوع الفاونديشن! 💄🤦‍♀️

كتير صبايا بيرموا الفاونديشن بالزبالة وبيفكروا إنو ماركته سيئة.
الحقيقة هي "تضارب كيميائي" عم تعمليه بإيدك بدون ما تعرفي!

افحصي علبة مرطبك وعلبة فاونديشنك:
• إذا كان المرطب أو البرايمر مائي (Water-based).
• والفاونديشن مليان سيليكون (Dimethicone / Silicone-based).
فأنتِ حرفياً عم تحطي زيت فوق مي!
المادتين مستحيل يندمجوا، وأول ما يتحرك وجهك أو تعرقي، الفاونديشن رح يفرط كتل صغيرة ويخطط حول التم والأنف! ❌

💡 الحل السحري:
استخدمي برايمر وفاونديشن من نفس القاعدة (تنيناتهن سيليكون، أو تنيناتهن مائي).

صايرة معك هالمشكلة بالسهرات؟ احفظي البوست لتتذكري تفحصي مكوناتك! 📌

#foundationhacks #مكياج_سهرة #فاونديشن #نصائح_مكياج #beautytips`
  },
  {
    id: 'french_vs_korean',
    title: 'كريمات سيكالفات وسيكابلاست مش مرطب يومي! (سد المسام)',
    badge: '🇫🇷 الصيدليات ضد الكوريات 🇰🇷',
    image: 'fact_butter_skin.jpg',
    generateStory: () => `كريمات سيكالفات وسيكابلاست مش مرطب يومي! أكبر مقلب عم تقع فيه البنات 🇫🇷🚫

نص بنات تيك توك بيشتروا مراهم الحروق والترميم (متل Cicalfate أو Cicaplast) وبيحطوها كل ليلة كمرطب وجه عادي!

اسمعي الحقيقة من الآخر:
هالمراهم مصممة كـ "ضمادة كيميائية" للجروح والحروق وجلسات الليزر القوية.
هي تقيلة ومليانة زنك وشمع وزيوت بتسد المسام تماماً لو استخدمتيها يومياً ع وجه معرض للحبوب، ورح تصحي تلاقي حبوب صغيرة بيضا تحت الجلد (Milia)! ⚠️

الكوريات شو بيعملوا بدالها؟
بيستخدموا سيرومات خفيفة بـ Centella Asiatica والبانثينول 1% بترمم الحاجز بدون ما تخنق المسام.

مين كانت تستخدم هالمراهم كل يوم؟ اعترفي بالكومنت! 😭👇

#cicaplast #cicalfate #عناية_بالبشرة #مسام #koreanskincare #skintips`
  },
  {
    id: 'rosemary_water',
    title: 'ماء الروزماري لكثافة البيبي هير (حقيقة تريند الـ 2 مليار مشاهدة)',
    badge: '🌿 تريند ماء الروزماري للشعر',
    image: 'fact_serum_pipette.jpg',
    generateStory: () => `تريند ماء الروزماري اللي عنده 2 مليار مشاهدة ع تيك توك: حقيقة ولا وهم؟ 🌿💇‍♀️

كل الصبايا عم يغلوا روزماري وقرنفل بالبيت تيكثفوا البيبي هير.
هل فعلاً بيشتغل؟

العلم بيقول: نعم!
دراسة سريرية أثبتت إنو زيت الروزماري المركز بيعطي نفس مفعول الـ Minoxidil 2% بتحفيز الدورة الدموية لبصيلات الشعر بعد 6 أشهر، بس بدون الآثار الجانبية المزعجة.

⚠️ بس انتبهي من 3 أخطاء بتعمل تساقط:
1. غليه لساعات بيحرق الزيوت الطيارة المفيدة. انقعيه بمي مغلية ومغطاية.
2. تركه بالبراد أكتر من 7 أيام بيخليه يعبي بكتيريا ترشيها ع فروة راسك!
3. لازم تحفظيه بقنينة سبراي معقمة وتستخدميه 3 مرات بالأسبوع.

جربتي الروزماري ولا بعدك؟ اكتبي تجربتك بالتعليقات! 👇

#rosemarywater #تكثيف_الشعر #عناية_بالشعر #بيبي_هير #hairtok`
  },
  {
    id: 'water_barrier',
    title: 'مياه لبنان وحاجز البشرة (المقلب اللي عم يطلّع حبوب مفاجئة)',
    badge: '🚿 مياه الصنبور وتلف الحاجز',
    image: 'fact_water_barrier.jpg',
    generateStory: () => `إذا عم تغسلي وجهك بمي سخنة من الحنفية بلبنان، فأنتِ عم تدمري حاجز بشرتك بدون ما تنتبهي! ⚠️🚿

ليش فجأة بتطلعلك حبوب غريبة أو جفاف وتحسس؟
مياه الخزانات والصنبور قلوية (pH بيوصل لـ 8.0)، بينما بشرتك الطبيعية حمضية ومحمية بـ Acid Mantle دقيق جداً (pH 5.5).

كل ما تغسلي بالصابون والمي العادية:
1️⃣ بتجردي الجلد من الدهون الطبيعية الواقية.
2️⃣ بكتيريا الحبوب بتلاقي البيئة القلوية المثالية لتتكاثر!

💡 الحل الفوري الليلة:
• لا تستخدمي مي سخنة أبداً — مي فاترة مائلة للبرودة فقط.
• رشي تونر مهدئ فورا بعد التنشيف لترجعي درجة الـ pH الطبيعية لحاجزك قبل ما تجف.

احفظي البوست لترجعي له بروتينك الليلة! 📌
وخبرينا بالتعليقات: عم تحسي بشرتك شادة أو عم تقشر بعد الحمام؟ 👇

#عناية_بالبشرة #حاجز_البشرة #skincarelebanon #beautytips #لبنان #نضارة_البشرة`
  },
  {
    id: 'snail_mucin_allergy',
    title: 'فخ حلزون الكوريات (Snail Mucin): مين ممنوع تلمسه نهائياً؟',
    badge: '🐌 فخ حلزون الكوريات',
    image: 'fact_serum_pipette.jpg',
    generateStory: () => `كل تيك توك بيمدح بسيروم الحلزون.. بس هيدي الفئة ممنوع تلمسه نهائياً! 🐌🚫

إذا استخدمتي الـ Snail Mucin وطلعلك فجأة حبوب ناعمة حمرا وحكة، فأنتِ مش عم تمري بـ Purging.. أنتِ عندك حساسية!

السر الطبي اللي ولا حدا بيحكي عنه:
إذا عندك حساسية من غبار وعث المنزل (Dust Mites) أو المحار والمأكولات البحرية (Shellfish)..
فبشرتك رح تتفاعل مع بروتينات الحلزون بنفس الطريقة وتعملك رد فعل تحسسي وتخربلك وجهك! ⚠️

البديل الآمن للكوريات:
سيروم الـ Beta-Glucan أو مستخلص الرز المخمر.. بيعطي نفس الشد والنضارة الممتلئة بدون أي تحسس.

مين جربت الحلزون وما ناسبها؟ ارفعوا إيدكم بالكومنت! 🙋‍♀️👇

#snailmucin #عناية_كورية #حبوب_البشرة #حساسية_الجلد #kbeautyreview`
  },
  {
    id: 'lip_basting',
    title: 'شفايف فيلر طبيعية بـ 0 دولار (Lip Basting قبل النوم)',
    badge: '👄 شفايف فيلر بـ 0 دولار',
    image: 'fact_butter_skin.jpg',
    generateStory: () => `ودّعي تشققات الشفايف للأبد.. حيلة الـ Lip Basting اللي بتغنيكي عن الفيلر المؤقت! 👄✨

مرطبات الشفايف العادية ما عم تفيدك لأنك عم ترطبي فوق طبقة جلد ميت سميكة!

طريقة أطباء الجلدية بنيويورك (Lip Basting):
1️⃣ الخطوة 1: نقطة سيروم حمض جليكوليك أو لاكتيك خفيف ع شفايفك لـ 30 ثانية لتذويب القشور الميتة بلطف.
2️⃣ الخطوة 2: طبقة سميكة جداً من مرهم غني بالسيراميد أو الفازلين الطبي قبل النوم.

الصبح بتمسحي شفايفك بقطنة ناعمة.. ورح تنصدمي كيف الجلد الميت بينزل وتصحي بشفايف ممتلئة وناعمة كأنك حاقنة فيلر ترطيب!

احفظي الطريقة وجربيها الليلة قبل ما تنامي! 📌🤍

#lipbasting #شفايف_وردية #ترطيب_الشفايف #lipcare #نصائح_تجميل`
  },
  {
    id: 'sixty_second_wash',
    title: 'قاعدة الـ 60 ثانية لغسول الوجه (السر المجاني لتنظيف المسام)',
    badge: '⏱️ قاعدة الـ 60 ثانية',
    image: 'fact_water_barrier.jpg',
    generateStory: () => `بتغسلي وجهك بـ 10 ثوانٍ؟ أنتِ حرفياً عم ترمي مصاريكي بالمجلى! ⏱️🫧

قاعدة الـ 60 ثانية (The 60-Second Rule) هي أكبر تحول مجاني ممكن تعمليه لبشرتك اليوم.

معظم البنات بيحطوا الغسول، بفركوا ركض 10 ثوانٍ وبيغسلوا بمي!
المشكلة؟
مكونات الغسول الفعالة (متل الساليسيليك، النياسيناميد، والزنك) بتحتاج 60 ثانية كاملة لتتغلغل داخل المسام، وتفكك الزيوت المتصلبة والأوساخ.

جربي من الليلة:
حطي الغسول ومسّجي بحركات دائرية ناعمة مع العد لـ 60 ثانية بهدوء خصوصي حول الأنف والدقن.
خلال أسبوع واحد رح تشوفي الرؤوس السوداء اختفت وملمس بشرتك صار ناعم متل الحرير!

مين بتغسل وجهها عالسريع متلي؟ اعترفوا بالتعليقات! 😭👇

#غسول_الوجه #60secondrule #تنظيف_البشرة #مسام_نظيفة #beautytok`
  },
  {
    id: 'retinal_11x',
    title: 'سر الـ 11x: ليش الريتينال بيشد المسام بأسبوعين والريتينول بياخد 6 أشهر؟',
    badge: '💛 سر الـ 11x السريري',
    image: 'fact_serum_pipette.jpg',
    generateStory: () => `ليه دكاترة الجلدية بكوريا صاروا يفضلوا الريتينال على الريتينول العادي؟ 🔬💛

المعادلة الكيميائية بسيطة جداً:
بشرتك تتقدر تستفيد من فيتامين A وتبني كولاجين، لازم تحوله لشكل نشط اسمه (Retinoic Acid).

• الريتينول العادي: بيحتاج خطوتين تحويل كيميائي بالخلايا (Retinol ➡️ Retinal ➡️ Retinoic Acid).
مشان هيك بياخد 6 أشهر وغالباً بيعمل تهيج بدون نتيجة سريعة!

• الريتينالديهايد (Retinal): بيفصله خطوة واحدة فقط!
يعني أسرع بـ 11 مرة بتحفيز الكولاجين وشد المسام ومحاربة البكتيريا المسببة للحبوب!

وفوق هيك بأنبوب سيلماكس الألمنيوم محمي من الأكسدة 100%.

جربتي الريتينال من قبل؟ اكتبي تجربتك بالكومنت! 👇

#ريتينال #ريتينول #celimax #عناية_كورية #لبنان #نضارة`
  },
  {
    id: 'skin_cycling_4days',
    title: 'جدول الـ Skin Cycling: كيف تستخدمي المقشرات بدون ما تحرقي وجهك؟',
    badge: '🔄 جدول الـ Skin Cycling',
    image: 'fact_water_barrier.jpg',
    generateStory: () => `حارقة وجهك ومقشرة جلدك لأنك عم تحطي أحماض كل ليلة؟ وقفي فورا! 🛑✨

جدول الـ Skin Cycling اللي اخترعته دكتورة ويتني بو بنيويورك هو الحل السحري:

روتين الـ 4 ليالٍ المتكرر:
🌙 الليلة 1 (تقشير): سيروم حمض جليكوليك أو ساليسيليك لتنظيف سطح الجلد وتجهيز المسام.
🌙 الليلة 2 (ريتينويد): سيروم الريتينال لتحفيز الكولاجين وتجديد الخلايا بعمق.
🌙 الليلة 3 (ترميم): راحة تامة! مرطب غني بالسيراميد والبانثينول فقط.
🌙 الليلة 4 (ترميم): راحة تامة وترطيب عميق لتقوية حاجز البشرة.

بهالطريقة بتاخدي نضارة وشباب بدون احمرار أو تقشير مزعج نهائياً!
جربتي هالجدول قبل؟ اكتبي بالتعليقات! 🤍👇

#skincycling #عناية_بالبشرة #تقشير_الوجه #نضارة #بشرة_صحية`
  },
  {
    id: 'retinoid_sandwich',
    title: 'طريقة الساندويش (Sandwich Method): سر استخدام الريتينول للبشرة الحساسة',
    badge: '🥪 تكنيك الساندويش',
    image: 'fact_butter_skin.jpg',
    generateStory: () => `بشرتك حساسة وبتخافي من تقشير واحمرار الريتينويد؟ جربي تكنيك الساندويش! 🥪✨

كتير بنات بيتركوا الريتينول من أول أسبوع لأن بشرتهم بتتهيج وبتحمر.
أطباء الجلدية بكوريا بينصحوا بحيلة "الساندويش":

الخطوات:
1️⃣ الطبقة 1: طبقة رقيقة من كريم مرطب خفيف ع وجه نظيف ومجفف تماماً.
2️⃣ الطبقة 2: حبة بازلاء من سيروم الريتينال (وزعيها بنقاط ناعمة).
3️⃣ الطبقة 3: طبقة تانية من المرطب فوقها مباشرة!

هيك المرطب بيعمل عازل لطيف يخلي الريتينال يتسرب بهدوء داخل الخلايا بدون أي صدمة للطبقة السطحية!
احفظي البوست لتجربيها الليلة! 📌🤍

#retinolforbeginners #sandwichmethod #ريتينول #عناية_كورية #بشرة_حساسة`
  },
  {
    id: 'hair_oiling_trap',
    title: 'تزييت الشعر طول الليل: الفخ اللي عم يوقع شعرك ويسد الفروة!',
    badge: '💇‍♀️ فخ تزييت الشعر',
    image: 'fact_serum_pipette.jpg',
    generateStory: () => `بتنامي بالزيت ع شعرك ليلة كاملة؟ أنتِ عم تخنقي بصيلاتك بدون ما تعرفي! 😱🚨

كتير صبايا بيفكروا "كل ما تركت الزيت أكتر، كل ما الشعر غذي أكتر".
الحقيقة الطبية عكس هيك تماماً!

فروة الراس مليانة فطريات طبيعية اسمها (Malassezia).
لما تتركي زيت تقيل (متل الخروع أو جوز الهند) لـ 8 ساعات نوم:
1. الفطريات بتتغذى ع الزيت وتتكاثر بسرعة هائلة.
2. بتعملك قشرة دهنية وحكة والتهاب بصيلات يؤدي لتساقط الشعر بالخصل! ❌

💡 الطريقة الصح طبياً:
ساعة إلى ساعتين بالكتير قبل الاستحمام، مع مساج ناعم بأطراف الأصابع وغسيل مزدوج بالشامبو!

كم ساعة بتتركي الزيت ع شعرك؟ اعترفي بالكومنت! 👇

#hairoiling #تساقط_الشعر #عناية_بالشعر #زيوت_شعر #haircare`
  },
  {
    id: 'rice_water_glass_skin',
    title: 'ماء الرز المخمر: سر الكوريات لبشرة الزجاج (Glass Skin) بـ 0 دولار',
    badge: '🍚 سر ماء الرز الكوري',
    image: 'fact_ice_bowl.jpg',
    generateStory: () => `سر بشرة الزجاج (Glass Skin) اللي الكوريات متوارثينه من مئات السنين موجود بمطبخك! 🍚✨

ماء الرز المخمر مليان أحماض أمينية، وفيتامين E، ومادة الـ Inositol اللي بتشد المسام وتفتح التصبغات بلطف فائق.

طريقة التحضير بالبيت:
1️⃣ اغسلي فنجان رز نص غسلة لتشيلي الشوائب.
2️⃣ انقعيه بمي معقمة لمدة 24 إلى 48 ساعة بدرجة حرارة الغرفة حتى يتخمر وتصير ريحته حامضة خفيفة.
3️⃣ صفي المي وحطيها بقنينة سبراي بالبراد.

رشي منها كتونر صباحي ومسائي قبل السيروم، ورح تشوفي كيف البهتان والتصبغات بيختفوا ويحل محلهم لمعة زجاجية طبيعية!
احفظي الطريقة وجربيها اليوم! 📌🤍

#ricewater #glassskin #تونر_طبيعي #تفتيح_البشرة #عناية_كورية`
  }
];

// Helper to read state
function readState() {
  try {
    if (fs.existsSync(STATE_FILE)) {
      return JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
    }
  } catch (e) {}
  return {
    postCount: 0,
    currentIndex: 0,
    lastRunTime: 0,
    history: []
  };
}

function saveState(state) {
  try {
    fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2), 'utf8');
    return true;
  } catch (e) {
    return false;
  }
}

// Telegram Sender
async function sendToTelegram(topic) {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    throw new Error('Telegram Bot Token or Chat ID is missing');
  }

  const caption = topic.generateStory();
  const imagePath = path.join(IMAGES_DIR, topic.image);

  let telegramRes;
  if (fs.existsSync(imagePath)) {
    const fileBuffer = fs.readFileSync(imagePath);
    const mime = imagePath.endsWith('.png') ? 'image/png' : 'image/jpeg';
    const blob = new Blob([fileBuffer], { type: mime });

    const fitsInCaption = caption.length <= 1000;
    const photoCaption = fitsInCaption
      ? caption
      : `✨ ${topic.badge}\n\n(الكابشن الكامل جاهز للنسخ في الرسالة التالية مباشرة 👇)`;

    const formData = new FormData();
    formData.append('chat_id', TELEGRAM_CHAT_ID);
    formData.append('photo', blob, topic.image);
    formData.append('caption', photoCaption);

    const resp = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`, {
      method: 'POST',
      body: formData
    });
    telegramRes = await resp.json();

    // If caption was long, send full text
    if (!fitsInCaption && telegramRes.ok) {
      await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: caption
        })
      });
    }
  } else {
    // Text-only fallback
    const resp = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: caption
      })
    });
    telegramRes = await resp.json();
  }

  if (!telegramRes || !telegramRes.ok) {
    throw new Error(telegramRes ? telegramRes.description : 'Failed to send to Telegram');
  }

  return telegramRes;
}

// Generator & Dispatcher Engine
async function triggerNextPost() {
  const state = readState();
  const index = state.currentIndex % TOPIC_LIBRARY.length;
  const topic = TOPIC_LIBRARY[index];

  console.log(`[AI Organic Bot] 🤖 Generating & dispatching Post #${state.postCount + 1}: "${topic.title}"...`);
  
  await sendToTelegram(topic);

  state.lastRunTime = Date.now();
  state.postCount = (state.postCount || 0) + 1;
  state.currentIndex = (index + 1) % TOPIC_LIBRARY.length;
  state.lastTitle = topic.title;
  saveState(state);

  console.log(`[AI Organic Bot] ✅ Post successfully delivered to Telegram! Next post in ${POST_INTERVAL_HOURS}h.`);
  return { success: true, topic: topic.title, postNumber: state.postCount };
}

// Background Cron Loop (Checks every 10 minutes)
async function cronCheck() {
  const state = readState();
  const now = Date.now();
  const intervalMs = POST_INTERVAL_HOURS * 60 * 60 * 1000;
  const elapsed = now - (state.lastRunTime || 0);

  if (elapsed >= intervalMs) {
    try {
      await triggerNextPost();
    } catch (err) {
      console.error('[AI Organic Bot] ❌ Cron Error:', err.message);
    }
  }
}

setInterval(cronCheck, 10 * 60 * 1000);

// Minimal HTTP Server for Render free tier & keep-alive
const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (url.pathname === '/trigger') {
    try {
      const result = await triggerNextPost();
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      return res.end(JSON.stringify(result));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
      return res.end(JSON.stringify({ error: err.message }));
    }
  }

  // Health / Status endpoint
  const state = readState();
  const nextTopic = TOPIC_LIBRARY[state.currentIndex % TOPIC_LIBRARY.length];
  const now = Date.now();
  const intervalMs = POST_INTERVAL_HOURS * 60 * 60 * 1000;
  const elapsed = now - (state.lastRunTime || 0);
  const remainingHours = Math.max(0, Math.round(((intervalMs - elapsed) / 3600000) * 10) / 10);

  if (url.pathname === '/status') {
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    return res.end(JSON.stringify({
      status: 'active',
      cost: '$0.00 (100% Free AI Engine)',
      intervalHours: POST_INTERVAL_HOURS,
      totalPostsSent: state.postCount || 0,
      nextTopic: nextTopic.title,
      hoursUntilNextPost: remainingHours
    }));
  }

  // Visual status card
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(`<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <title>LUMEN AI Organic Growth Bot (100% Free)</title>
  <style>
    body { background: #0B0F19; color: #F8FAFC; font-family: system-ui, sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 20px; box-sizing: border-box; }
    .card { background: #131B2E; border: 1px solid #1E293B; border-radius: 16px; padding: 32px; max-width: 520px; width: 100%; box-shadow: 0 10px 30px rgba(0,0,0,0.5); text-align: center; }
    .badge { display: inline-block; background: rgba(16, 185, 129, 0.15); color: #34D399; border: 1px solid #10B981; padding: 4px 12px; border-radius: 20px; font-size: 0.85rem; font-weight: bold; margin-bottom: 16px; }
    h1 { font-size: 1.4rem; margin-bottom: 8px; color: #FFF; }
    p { color: #94A3B8; font-size: 0.92rem; line-height: 1.6; margin-bottom: 20px; }
    .stat-box { background: #090D16; border: 1px solid #1E293B; border-radius: 10px; padding: 16px; margin-bottom: 20px; text-align: right; }
    .stat-row { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 0.88rem; }
    .btn-trigger { background: #10B981; color: #0C0F17; border: none; padding: 12px 24px; border-radius: 10px; font-weight: bold; font-size: 0.95rem; cursor: pointer; text-decoration: none; display: inline-block; transition: transform 0.2s; }
    .btn-trigger:hover { transform: translateY(-2px); background: #34D399; }
  </style>
</head>
<body>
  <div class="card">
    <span class="badge">🟢 البوت يعمل 24/7 (تكلفة $0.00 مجاني تماماً)</span>
    <h1>LUMEN Organic Growth Engine</h1>
    <p>بوت الذكاء الاصطناعي لتوليد ونشر بوستات الجمال الفيروسية تلقائياً كل 24 ساعة إلى تليغرام.</p>
    
    <div class="stat-box">
      <div class="stat-row"><span style="color: #94A3B8;">إجمالي البوستات المرسلة:</span><strong>${state.postCount || 0} بوستات</strong></div>
      <div class="stat-row"><span style="color: #94A3B8;">الموضوع القادم:</span><strong style="color: #A3E635;">${nextTopic.title}</strong></div>
      <div class="stat-row"><span style="color: #94A3B8;">الوقت المتبقي:</span><strong>${remainingHours} ساعة</strong></div>
      <div class="stat-row"><span style="color: #94A3B8;">التكلفة:</span><strong style="color: #34D399;">$0.00 مجاني</strong></div>
    </div>

    <a href="/trigger" class="btn-trigger">⚡ أرسل البوست التالي لهاتفي الآن</a>
  </div>
</body>
</html>`);
});

server.listen(PORT, () => {
  console.log(`[AI Organic Bot] Server running on port ${PORT}`);
  console.log(`[AI Organic Bot] Cost: $0.00 (Zero paid AI APIs)`);
  console.log(`[AI Organic Bot] Destination: Telegram Chat ${TELEGRAM_CHAT_ID}`);
});
