---
layout: about
title: about
permalink: /
nav: true
nav_order: 1

profile:
  align: right
  image: profile.jpg
  image_circular: false

social: true
---

## Karine Levonyan

Research Scientist / Data Scientist / AI

I am an AI Research Scientist with a strong foundation in mathematics and artificial intelligence. My expertise spans both theoretical frameworks and practical applications in AI, with a focus on facial recognition, computer vision, and algorithmic optimization. I'm passionate about developing innovative solutions that bridge the gap between theoretical research and practical applications in AI.

---

### Research Interests

- Machine Learning  
- Computer Vision  
- Facial Recognition  
- Algorithmic Optimization  
- AI for Digital Content Creation  

---

## Recent Posts

<ul>
  {% for post in site.posts limit:3 %}
    <li>
      <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
      <span>— {{ post.date | date: "%B %d, %Y" }}</span>
    </li>
  {% endfor %}
</ul>

---

### Links

- [Google Scholar](https://scholar.google.com/citations?user=L--pFAcAAAAJ&hl=en)
- [GitHub](https://github.com/karine)
- [LinkedIn](https://www.linkedin.com/in/karinelevonyan)

---

### Education

**Ph.D./MS in Computational Physics**  
Specializing in Energy Resources Engineering  
Stanford University | 2019

**Bachelor's in Applied Mathematics**  
Gubkin University | 2008  
Minor: Computer Science
