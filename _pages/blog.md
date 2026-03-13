---
layout: page
title: blog
permalink: /blog/
nav: true
nav_order: 5
---

## Blog

{% for post in site.posts %}
- [{{ post.title }}]({{ post.url | relative_url }}) — {{ post.date | date: "%B %d, %Y" }}
{% endfor %}