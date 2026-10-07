# আমার গল্প – GitHub Pages Blogging Site

সহজ ও সুন্দর বাংলা ব্লগিং সাইট।  
`story/` ফোল্ডারে `.txt` ফাইল + `pic/` ফোল্ডারে একই নামে ছবি রাখলেই সাইটে গল্প দেখা যাবে।

---

## কীভাবে ব্যবহার করবেন (ধাপে ধাপে)

### ১. GitHub-এ Repository বানান
1. [github.com](https://github.com) এ যান → **New repository**
2. নাম দিন (যেমন: `amar-golpo`)
3. **Public** রাখুন
4. **Create repository** চাপুন

### ২. এই ফাইলগুলো আপলোড করুন
Repository-তে নিচের ফাইল/ফোল্ডারগুলো রাখুন:

```
├── index.html
├── style.css
├── script.js
├── config.js          ← এখানে username/repo লিখতে হবে
├── story/
│   └── prothom-golpo.txt   (উদাহরণ)
└── pic/
    └── prothom-golpo.jpg   (একই নামে ছবি)
```

### ৩. config.js এডিট করুন
`config.js` ফাইল খুলে শুধু এই লাইনটা বদলান:

```js
githubRepo: "YOUR_USERNAME/YOUR_REPO_NAME",
```

উদাহরণ:
```js
githubRepo: "rahim/amar-golpo",
```

### ৪. GitHub Pages চালু করুন
1. Repository → **Settings** → বামদিকে **Pages**
2. Source: **Deploy from a branch**
3. Branch: `main` (বা `master`) → `/ (root)` → **Save**
4. কয়েক মিনিট পর সাইট লাইভ হবে:  
   `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME`

### ৫. নিজের Domain (DigitalPlat) যোগ করুন
1. DigitalPlat থেকে যে ডোমেইন কিনেছেন, তার DNS-এ এই রেকর্ড দিন:

| Type  | Name | Value                          |
|-------|------|--------------------------------|
| A     | @    | 185.199.108.153               |
| A     | @    | 185.199.109.153               |
| A     | @    | 185.199.110.153               |
| A     | @    | 185.199.111.153               |
| CNAME | www  | YOUR_USERNAME.github.io       |

2. GitHub Pages Settings-এ **Custom domain** বক্সে আপনার ডোমেইন লিখুন (যেমন: `myblog.com`)
3. **Enforce HTTPS** টিক দিন

---

## নতুন গল্প যোগ করার নিয়ম

1. `story/` ফোল্ডারে একটা `.txt` ফাইল আপলোড করুন  
   উদাহরণ: `ratri-r-golpo.txt`

2. `pic/` ফোল্ডারে **একই নামে** ছবি আপলোড করুন  
   উদাহরণ: `ratri-r-golpo.jpg` বা `.png` বা `.webp`

3. `.txt` ফাইলের **প্রথম লাইন** হবে গল্পের শিরোনাম (Title)  
   বাকি লাইনগুলো হবে গল্পের মূল লেখা।

4. সাইট নিজে থেকেই নতুন গল্প দেখাবে (কয়েক সেকেন্ড পর refresh করুন)।

---

## নোট
- Repository **Public** থাকতে হবে (GitHub API কাজ করার জন্য)
- ছবির সাপোর্টেড ফরম্যাট: `.jpg` `.jpeg` `.png` `.webp` `.gif`
- মোবাইলেও সুন্দর দেখাবে (responsive)

শুধু গল্প লিখুন আর ছবি দিন — বাকিটা সাইট দেখে নেবে!
