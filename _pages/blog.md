---
layout: page
title: blog
permalink: /blog/
nav: true
nav_order: 5
---

## Blog

I will use this blog to share articles, thoughts on scientific papers, and technical writing related to AI.

{% for post in site.posts %}
- [{{ post.title }}]({{ post.url | relative_url }}) — {{ post.date | date: "%B %d, %Y" }}
{% endfor %}