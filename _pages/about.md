---
permalink: /
title: ""
author_profile: true
redirect_from: 
  - /about/
  - /about.html
---

<style>
/* --- 全局样式优化 --- */
body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    color: #333;
    line-height: 1.6;
}

a { color: #0056b3; text-decoration: none; transition: all 0.2s ease; }
a:hover { color: #d9534f; text-decoration: underline; }

/* --- 个人简介部分 --- */
.intro-text { font-size: 1.05em; margin-bottom: 20px; }
.social-links { margin-top: 10px; font-size: 0.95em; }
.social-links a { margin-right: 15px; font-weight: 600; }

/* --- News 样式 --- */
.news-container { margin-bottom: 30px; }
.news-item {
    display: flex;
    margin-bottom: 12px;
    align-items: baseline;
}
.news-date {
    flex: 0 0 100px;
    font-weight: bold;
    color: #555;
    font-size: 0.9em;
    font-family: monospace;
}
.news-content { flex: 1; }
.news-badge {
    background: #e7f3ff;
    color: #0056b3;
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 0.8em;
    margin-right: 5px;
    font-weight: bold;
}

/* 按钮样式 */
.btn-toggle {
    background-color: #f6f8fa;
    border: 1px solid #d1d5da;
    color: #24292e;
    padding: 6px 12px;
    border-radius: 6px;
    font-size: 14px;
    cursor: pointer;
    font-weight: 600;
    transition: 0.2s;
    display: block;
    margin: 15px auto;
    width: fit-content;
}
.btn-toggle:hover { background-color: #e1e4e8; text-decoration: none; }

/* --- Publications 样式 --- */
.pub-list { list-style: none; padding: 0; }
.pub-item {
    margin-bottom: 25px;
    padding-left: 15px;
    border-left: 3px solid #eee;
    transition: border-color 0.3s;
}
.pub-item:hover { border-left-color: #0056b3; }
.pub-title {
    font-weight: 700;
    font-size: 1.05em;
    color: #222;
    display: block;
    margin-bottom: 4px;
}
.pub-authors { font-size: 0.95em; color: #555; margin-bottom: 4px; display: block; }
.me { color: #b02418; font-weight: bold; text-decoration: underline; }
.pub-venue { font-style: italic; color: #0056b3; font-weight: 600; }
.pub-links { margin-top: 6px; display: block; }

/* 论文链接按钮 */
.pub-btn {
    display: inline-block;
    padding: 2px 8px;
    margin-right: 6px;
    font-size: 0.8em;
    border: 1px solid #0056b3;
    border-radius: 4px;
    color: #0056b3;
    text-decoration: none;
    background: white;
}
.pub-btn:hover { background: #0056b3; color: white; text-decoration: none; }

/* 论文标签 (Oral, Poster, Award) */
.tag {
    display: inline-block;
    padding: 1px 6px;
    border-radius: 4px;
    font-size: 0.75em;
    font-weight: bold;
    margin-left: 6px;
    vertical-align: middle;
}
.tag-oral { background-color: #fff3cd; color: #856404; border: 1px solid #ffeeba; }
.tag-poster { background-color: #d4edda; color: #155724; border: 1px solid #c3e6cb; }
.tag-award { background-color: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; }
.tag-best { background-color: #d1ecf1; color: #0c5460; border: 1px solid #bee5eb; }

/* --- 奖项列表 --- */
.award-list li { margin-bottom: 10px; }
.award-year { font-weight: bold; color: #b02418; margin-right: 8px; }

/* --- 书籍列表 --- */
.book-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 15px;
    margin-top: 20px;
}
.book-item { text-align: center; font-size: 0.8em; }
.book-cover {
    width: 80px;
    height: 120px;
    object-fit: cover;
    box-shadow: 2px 2px 5px rgba(0,0,0,0.2);
    border-radius: 4px;
    transition: transform 0.2s;
}
.book-cover:hover { transform: scale(1.05); }

/* --- 标题修饰 --- */
h1, h2 { color: #2c3e50; border-bottom: none; }
h2 { margin-top: 40px !important; margin-bottom: 20px; border-left: 5px solid #b02418; padding-left: 10px; font-size: 1.5em; }

</style>

{% if site.google_scholar_stats_use_cdn %}
{% assign gsDataBaseUrl = "https://cdn.jsdelivr.net/gh/" | append: site.repository | append: "@" %}
{% else %}
{% assign gsDataBaseUrl = "https://raw.githubusercontent.com/" | append: site.repository | append: "/" %}
{% endif %}
{% assign url = gsDataBaseUrl | append: "google-scholar-stats/gs_data_shieldsio.json" %}

<div class="intro-text">
<p>I'm a Second-year PhD student from <a href="https://www.med.tsinghua.edu.cn/en/">School of Biomedical Engineering</a>, <a href="https://www.tsinghua.edu.cn/">Tsinghua University</a>. My research interest includes <strong>AI for Neuroscience, Medical Image Analysis, and Spiking Neural Networks</strong>.</p>

<p>I am very fortunate to be advised by <a href="https://www.med.tsinghua.edu.cn/info/1143/2126.htm">Prof. Qiyuan Tian</a> of <a href="https://birthlab.github.io/">Birth Lab</a> from School of Biomedical Engineering, Tsinghua University.</p>

<p>I was previously advised by <a href="http://hongchen.ime.tsinghua.edu.cn/">Prof. Hong Chen</a> from <a href="https://www.sic.tsinghua.edu.cn/en/index.htm">School of Integrated Circuits</a>, Tsinghua University.</p>

<div class="social-links">
  <a href="https://github.com/Arktis2022/CV-Mingxuan-Liu/blob/main/CV-Mingxuan%20Liu.pdf">📄 Curriculum Vitae</a>
  <a href="https://github.com/Arktis2022">🐈 Github</a>
  <a href="https://scholar.google.com/citations?user=8VyGtD0AAAAJ&hl=zh-CN">🎓 Google Scholar</a>
  <a href="https://www.semanticscholar.org/author/Mingxuan-Liu/2112213258">📚 Semantic Scholar</a>
  <a href="../images/wechat.jpg">💬 Wechat</a>
</div>

<div style="margin-top: 15px;">
<a href='https://scholar.google.com.hk/citations?hl=zh-CN&user=8VyGtD0AAAAJ'><img src="https://img.shields.io/endpoint?url={{ url | url_encode }}&logo=Google%20Scholar&labelColor=f6f6f6&color=9cf&style=flat&label=citations"></a>
</div>
</div>

---

# 📻 News

<div class="news-container">
<div id="recent-news">

  <div class="news-item">
    <div class="news-date">2025.12.21</div>
    <div class="news-content"><span class="news-badge">New</span>One abstract accepted by <strong>WOC 2026</strong>.</div>
  </div>

  <div class="news-item">
    <div class="news-date">2025.12.06</div>
    <div class="news-content"><span class="news-badge">Paper</span>One <a href="https://doi.org/10.1101/2025.06.04.657810">paper</a> accepted by <strong>Imaging Neuroscience</strong>.</div>
  </div>

  <div class="news-item">
    <div class="news-date">2025.11.22</div>
    <div class="news-content">Attended the 2nd Graduate Academic Forum (Tsinghua BME & Clinical Medicine) and awarded <a href="https://drive.google.com/file/d/1wz1tAzSku36oPj3jLJ6DrqCYEHamPOiW/view?usp=sharing"><strong>Invited Student Speaker Award</strong></a>. <a href="https://img.erpweb.eu.org/imgs/2025/12/f6c7ff3788f3fa0e.jpg">[Photo]</a> <a href="https://img.erpweb.eu.org/imgs/2025/12/abfd2851a152ef49.jpg">[Photo]</a></div>
  </div>

  <div class="news-item">
    <div class="news-date">2025.11.20</div>
    <div class="news-content">One abstract accepted by <strong>APAO 2026</strong>.</div>
  </div>

  <div class="news-item">
    <div class="news-date">2025.11.15</div>
    <div class="news-content">Attended the CHINESE CONGRESS OF RADIOLOGY (CCR) 2025 in Changsha. <a href="https://img.erpweb.eu.org/imgs/2025/11/498636a54e2a6196.jpg">[Photo]</a></div>
  </div>

</div>

<!-- 隐藏的旧新闻 -->
<div id="more-news" style="display: none;">

  <div class="news-item">
    <div class="news-date">2025.11.08</div>
    <div class="news-content">Attended Tsinghua Academic Path Series #724 (Sharing Session with 2025 National Scholarship Awardees). <a href="https://mp.weixin.qq.com/s/Nqc9D1m3tXEAAhT0WqoRqA">[Link]</a></div>
  </div>

  <div class="news-item">
    <div class="news-date">2025.11.04</div>
    <div class="news-content">Attended CASFIS in Hong Kong. <a href="https://img.erpweb.eu.org/imgs/2025/11/f9e94181835f1b08.jpg">[Photo]</a></div>
  </div>

  <div class="news-item">
    <div class="news-date">2025.10.24</div>
    <div class="news-content">Awarded <strong>Second Prize of Oral Presentation</strong> at <a href="https://www.medcircle.cn/meeting/index/2025bs">Beijing-Tsinghua Health AI Summit</a>. <a href="https://bme.tsinghua.edu.cn/info/1010/1530.htm">[News]</a></div>
  </div>
  
  <div class="news-item">
    <div class="news-date">2025.10.22</div>
    <div class="news-content">Presented work to Rupa Sarkar, Editor-in-Chief of <i>The Lancet Digital Health</i>.</div>
  </div>

  <div class="news-item">
    <div class="news-date">2025.09.27</div>
    <div class="news-content">🎉 <strong>MICCAI 2025 Highlights:</strong> Won 2nd place in <a href="https://vlm3dchallenge.com/">VLM3D Challenge</a> & 1st place in <a href="https://www.autopet.org/autopetiv.html">autoPET IV Challenge</a>.</div>
  </div>

  <div class="news-item">
    <div class="news-date">2025.08.08</div>
    <div class="news-content">Google Scholar citations reached 100! 🎈</div>
  </div>

  <div class="news-item">
    <div class="news-date">2025.07.22</div>
    <div class="news-content">Awarded <strong>1st Prize</strong> at the 10th National Biomedical Engineering Innovation Design Competition.</div>
  </div>

  <div class="news-item">
    <div class="news-date">2025.05.24</div>
    <div class="news-content">Awarded <strong>2025 OHBM Merit Award</strong> (Top 1.6%).</div>
  </div>

  <div class="news-item">
    <div class="news-date">2025.04.20</div>
    <div class="news-content">Awarded <strong>2024 ISMRM Magna Cum Laude Merit Award</strong> (Top 15%).</div>
  </div>

  <div class="news-item">
    <div class="news-date">2023.10.15</div>
    <div class="news-content">Awarded <strong>National Scholarship</strong> by Ministry of Education.</div>
  </div>

</div>

<button onclick="toggleNews()" id="news-toggle-btn" class="btn-toggle">Show more news</button>

</div>

<script>
function toggleNews() {
  var moreNews = document.getElementById("more-news");
  var btn = document.getElementById("news-toggle-btn");
  if (moreNews.style.display === "none") {
    moreNews.style.display = "block";
    btn.innerHTML = "Show less";
  } else {
    moreNews.style.display = "none";
    btn.innerHTML = "Show more";
  }
}
</script>

# 📝 Publications 

<span style="font-size:0.9em; color:#666;">
<span style="color:#b02418; font-weight:bold;">#</span> co-first author | <span style="color:#b02418; font-weight:bold;">*</span> corresponding author
</span>

## Journal Papers

<div class="pub-list">

<div class="pub-item">
  <span class="pub-title">Effects of diffusion MRI spatial resolution on human brain short-range association fiber reconstruction and structural connectivity estimation</span>
  <span class="pub-authors">Jialan Zheng, Ziyu Li*, Wen Zhong, Ziang Wang, Zihan Li, Hongjia Yang, <span class="me">Mingxuan Liu</span>, Xiaozhi Cao, Congyu Liao, David H. Salat, Susie Y. Huang, Qiyuan Tian*</span>
  <span class="pub-venue">Imaging Neuroscience (IMAG), 2026.</span>
  <div class="pub-links">
    <a href="https://doi.org/10.1101/2025.06.04.657810" class="pub-btn">Paper</a>
  </div>
</div>

<div class="pub-item">
  <span class="pub-title">Spiking-PhysFormer: Camera-Based Remote Photoplethysmography with Parallel Spike-driven Transformer</span>
  <span class="pub-authors"><span class="me">Mingxuan Liu#</span>, Jiankai Tang#, Chengli Yong, Haoxiang Li, Jiahao Qi, Siwei Li, Kegang Wang, Jie Gan, Yuntao Wang*, Hong Chen*</span>
  <span class="pub-venue">Neural Networks (NN), 2025.</span>
  <div class="pub-links">
    <a href="https://www.sciencedirect.com/science/article/pii/S0893608025000073" class="pub-btn">Paper</a>
    <a href="https://github.com/Arktis2022/Spiking-PhysFormer" class="pub-btn">Code</a>
  </div>
</div>

<div class="pub-item">
  <span class="pub-title">Anomaly Detection for Medical Images Using Teacher-Student Model with Skip Connections and Multi-scale Anomaly Consistency</span>
  <span class="pub-authors"><span class="me">Mingxuan Liu</span>, Yunrui Jiao, Jingqiao Lu, Hong Chen*</span>
  <span class="pub-venue">IEEE Transactions on Instrumentation and Measurement (IEEE TIM), 2024.</span>
  <div class="pub-links">
    <a href="https://doi.org/10.1109/TIM.2024.3406792" class="pub-btn">Paper</a>
    <a href="https://github.com/Arktis2022/Skip-TS" class="pub-btn">Code</a>
  </div>
</div>

</div>

## Conference Papers

<div class="pub-list">

<div class="pub-item">
  <span class="pub-title">WARPNet: Scale-wise Autoregressive Cross-modal Synthesis for Accurate and Detail-preserving MRI-to-PET Generation</span>
  <span class="pub-authors">Guanyu Zhou#, Yifei Chen#, Gaoxiang Ying, <span class="me">Mingxuan Liu</span>, Xuguang Bai, Jialan Zheng, Bixiao Cui, Qiyuan Tian*, Jie Lu*</span>
  <span class="pub-venue">IEEE BIBM 2025.</span>
  <span class="tag tag-oral">Oral</span>
</div>

<div class="pub-item">
  <span class="pub-title">DR-TTA: Dynamic and Robust Test-Time Adaptation Under Low-Quality MRI Conditions for Brain Tumor Segmentation</span>
  <span class="pub-authors">Yuanhan Wang#, Yifei Chen#, Shuo Jiang, Wenjing Yu, <span class="me">Mingxuan Liu</span>, Shenghao Zhu, Feiwei Qin, Changmiao Wang*</span>
  <span class="pub-venue">IEEE BIBM 2025.</span>
  <span class="tag tag-oral">Oral</span>
</div>

<div class="pub-item">
  <span class="pub-title">autoPET IV challenge: Incorporating organ supervision and human guidance for lesion segmentation in PET/CT</span>
  <span class="pub-authors">Junwei Huang, Yingqi Hao, Yitong Luo, Ziyu Wang, <span class="me">Mingxuan Liu</span>, Yifei Chen, Yuanhan Wang, Lei Xiang, Qiyuan Tian*</span>
  <span class="pub-venue">MICCAI autoPET IV challenge, 2025.</span>
  <span class="tag tag-best">1st Place Winner</span>
  <div class="pub-links">
    <a href="https://arxiv.org/pdf/2509.02402" class="pub-btn">Paper</a>
    <a href="https://github.com/huang-jw22/autoPET-4-submission/tree/master" class="pub-btn">Code</a>
  </div>
</div>

<div class="pub-item">
  <span class="pub-title">FetalExtract-LLM: Structured Information Extraction in Free-Text Fetal MRI Reports Based on Privacy-Ensuring Open-weights Large Language Models</span>
  <span class="pub-authors"><span class="me">Mingxuan Liu#</span>, Yijin Li#, Juncheng Zhu#, Hongjia Yang, Yiming Huang, Haoxiang Li, Yifei Chen, Xuguang Bai, Yi Liao, Haibo Qu, Qiyuan Tian*</span>
  <span class="pub-venue">MICCAI Workshop PIPPI, 2025.</span>
  <span class="tag tag-oral">Oral</span>
  <div class="pub-links">
    <a href="https://link.springer.com/chapter/10.1007/978-3-032-05997-0_11" class="pub-btn">Paper</a>
  </div>
</div>

<div class="pub-item">
  <span class="pub-title">Chest-OMDL: Organ-specific Multidisease Detection and Localization in Chest Computed Tomography using Weakly Supervised Deep Learning from Free-text Radiology Report</span>
  <span class="pub-authors">Xuguang Bai#, <span class="me">Mingxuan Liu#</span>, Yifei Chen, Hongjia Yang, Qiyuan Tian*</span>
  <span class="pub-venue">MIDL 2025.</span>
  <span class="tag tag-poster">Poster</span> <span class="tag tag-best">MICCAI VLM3D 2nd Place</span>
  <div class="pub-links">
    <a href="https://openreview.net/forum?id=ns6nq592HX" class="pub-btn">Paper</a>
    <a href="https://github.com/JasonW375/Chest-OMDL" class="pub-btn">Code</a>
  </div>
</div>

<div class="pub-item">
  <span class="pub-title">FetalCSR: Multi-input Attention Fusion Network for Neural ODE-based Fetal Cortical Surface Reconstruction</span>
  <span class="pub-authors">Haoxiang Li#, <span class="me">Mingxuan Liu#</span>, Xuguang Bai, Yi Liao, Jialan Zheng, Hongjia Yang, Zihan Li, Haibo Qu, Qiyuan Tian*</span>
  <span class="pub-venue">ICLR Workshop AI4CHL, 2025.</span>
  <span class="tag tag-oral">Oral</span>
  <div class="pub-links">
    <a href="https://hal.science/hal-05039904/document" class="pub-btn">Paper</a>
    <a href="https://github.com/lhx-lhx-lhx/FetalCSR" class="pub-btn">Code</a>
  </div>
</div>

<div class="pub-item">
  <span class="pub-title">Spike-SLR: An Energy-efficient Parallel Spiking Transformer for Event-based Sign Language Recognition</span>
  <span class="pub-authors">Xinxu Lin#, <span class="me">Mingxuan Liu#</span>, Kezhuo Liu, Hong Chen*</span>
  <span class="pub-venue">BMVC 2024.</span>
  <span class="tag tag-poster">Poster</span>
  <div class="pub-links">
    <a href="https://bmva-archive.org.uk/bmvc/2024/papers/Paper_493/paper.pdf" class="pub-btn">Paper</a>
    <a href="https://bmvc2024.org/proceedings/493/" class="pub-btn">Project</a>
  </div>
</div>

<div class="pub-item">
  <span class="pub-title">SAM-Deblur: Let Segment Anything Boost Image Deblurring</span>
  <span class="pub-authors">Siwei Li#, <span class="me">Mingxuan Liu#</span>, Yating Zhang, Shu Chen, Haoxiang Li, Hong Chen*, Zifei Dou*</span>
  <span class="pub-venue">IEEE ICASSP 2024.</span>
  <span class="tag tag-poster">Poster</span>
  <div class="pub-links">
    <a href="https://ieeexplore.ieee.org/abstract/document/10445844" class="pub-btn">Paper</a>
    <a href="https://hplqaq.github.io/projects/sam-deblur" class="pub-btn">Project</a>
  </div>
</div>

<div class="pub-item">
  <span class="pub-title">Spiking-Diffusion: Vector Quantized Discrete Diffusion Model with Spiking Neural Networks</span>
  <span class="pub-authors"><span class="me">Mingxuan Liu#</span>, Jie Gan#, Rui Wen#, Tao Li, Yongli Chen, Hong Chen*</span>
  <span class="pub-venue">IEEE ICCBD+AI 2024.</span>
  <span class="tag tag-award">Best Paper Award</span>
  <div class="pub-links">
    <a href="https://ieeexplore.ieee.org/document/10933745" class="pub-btn">Paper</a>
    <a href="https://github.com/Arktis2022/Spiking-Diffusion" class="pub-btn">Code</a>
  </div>
</div>

<div class="pub-item">
  <span class="pub-title">Skip-ST: Anomaly Detection for Medical Images Using Student-Teacher Network with Skip Connections</span>
  <span class="pub-authors"><span class="me">Mingxuan Liu</span>, Yunrui Jiao, Hong Chen*</span>
  <span class="pub-venue">IEEE ISCAS 2023.</span>
  <span class="tag tag-oral">Oral</span>
  <div class="pub-links">
    <a href="https://ieeexplore.ieee.org/abstract/document/10181639" class="pub-btn">Paper</a>
    <a href="https://github.com/Arktis2022/Skip-TS" class="pub-btn">Code</a>
  </div>
</div>

<div class="pub-item">
  <span class="pub-title">Data Augmentation Using Image-to-image Translation for Tongue Coating Thickness Classification with Imbalanced Data</span>
  <span class="pub-authors"><span class="me">Mingxuan Liu</span>, Yunrui Jiao, Hongyu Gu, Jingqiao Lu, Hong Chen*</span>
  <span class="pub-venue">IEEE BioCAS 2022.</span>
  <span class="tag tag-oral">Oral</span>
  <div class="pub-links">
    <a href="https://ieeexplore.ieee.org/document/9948645" class="pub-btn">Paper</a>
  </div>
</div>

</div>

## Conference Short Papers & Abstracts

<div class="pub-list">
<!-- 由于篇幅限制，这里仅展示部分精选摘要，完整列表请保持原样 -->

<div class="pub-item">
  <span class="pub-title">Comprehensive Evaluation of Unsupervised Image Enhancement for Volumetric Fetal Brain MRI</span>
  <span class="pub-authors">Yingqi Hao#, <span class="me">Mingxuan Liu#</span>, et al.</span>
  <span class="pub-venue">MIDL 2025.</span>
  <span class="tag tag-poster">Poster</span>
  <div class="pub-links">
    <a href="https://openreview.net/forum?id=RY54DHewSk" class="pub-btn">Paper</a>
  </div>
</div>

<div class="pub-item">
  <span class="pub-title">Unsupervised Fetal Brain MRI Quality Assessment based on Orientation Prediction Uncertainty</span>
  <span class="pub-authors"><span class="me">Mingxuan Liu</span>, et al.</span>
  <span class="pub-venue">OHBM 2025.</span>
  <span class="tag tag-award">Merit Award (Top 1.6%)</span>
</div>

<div class="pub-item">
  <span class="pub-title">FetalSR: Super-resolving High-isotropic-resolution Image Volume from Single Thick-slice Stack...</span>
  <span class="pub-authors">Yang H, <span class="me">Liu M</span>, et al.</span>
  <span class="pub-venue">ISMRM 2025.</span>
  <span class="tag tag-oral">Oral</span> <span class="tag tag-award">Summa Cum Laude (Top 5%)</span>
</div>

<div class="pub-item">
  <span class="pub-title">Detecting Fetal Germinal Matrix and Intraventricular Hemorrhage in Brain MRI Using Label-free Deep Learning</span>
  <span class="pub-authors"><span class="me">Mingxuan Liu</span>, et al.</span>
  <span class="pub-venue">RSNA 2024.</span>
  <span class="tag tag-oral">Oral</span>
</div>

<div class="pub-item">
  <span class="pub-title">Image Quality Assessment using an Orientation Recognition Network for Fetal MRI</span>
  <span class="pub-authors"><span class="me">Mingxuan Liu</span>, et al.</span>
  <span class="pub-venue">ISMRM 2024.</span>
  <span class="tag tag-oral">Power Pitch</span> <span class="tag tag-award">Magna Cum Laude (Top 15%)</span>
</div>

<div class="pub-item">
  <span class="pub-title">Label-free Image Quality Assessment of Fetal Brain MRI with Unsupervised Deep Learning</span>
  <span class="pub-authors"><span class="me">Mingxuan Liu</span>, et al.</span>
  <span class="pub-venue">Singapore AI Health Summit 2023.</span>
  <span class="tag tag-award">3rd Place Winner</span>
</div>

</div>

## Manuscripts Under Review

<div class="pub-list">
  <!-- 这里保留原有的 Under Review 列表，建议使用相同的 pub-item 结构 -->
  <div class="pub-item">
    <span class="pub-title">Quality-label-free Fetal Brain MRI Quality Control Based on Image Orientation Recognition Uncertainty</span>
    <span class="pub-authors"><span class="me">Mingxuan Liu#</span>, Yi Liao#, et al.</span>
    <span class="pub-venue">Medical Image Analysis (MIA).</span>
    <span class="tag">Major Revision</span>
  </div>
  
  <div class="pub-item">
    <span class="pub-title">MicroKAN: mapping human brain microstructure using diffusion MRI and convolutional Kolmogorov-Arnold Network</span>
    <span class="pub-authors">Yifei Chen#, Zihan Li#, <span class="me">Mingxuan Liu</span>, et al.</span>
    <span class="pub-venue">NeuroImage (NIMG).</span>
    <span class="tag">Under Review</span>
  </div>
</div>

# 🎖 Honors and Awards

<ul class="award-list">
  <li><span class="award-year">2025</span> <strong>Invited Student Speaker Award</strong>, 2nd Graduate Academic Forum, Tsinghua University</li>
  <li><span class="award-year">2025</span> <strong>National Scholarship</strong>, Ministry of Education, P.R. China (Top 0.2%)</li>
  <li><span class="award-year">2025</span> <strong>1st Place Winner</strong>, MICCAI autoPET IV Challenge</li>
  <li><span class="award-year">2025</span> <strong>OHBM Merit Award</strong> (Top 1.6%)</li>
  <li><span class="award-year">2024</span> <strong>National Scholarship</strong>, Ministry of Education, P.R. China</li>
  <li><span class="award-year">2024</span> <strong>Outstanding Graduate of Beijing</strong></li>
  <li><span class="award-year">2024</span> <strong>Outstanding Graduate Award (Top 2%)</strong>, Tsinghua University</li>
  <li><span class="award-year">2024</span> <strong>ISMRM Magna Cum Laude Merit Award</strong> (Top 15%)</li>
  <li><span class="award-year">2024</span> <strong>Best Paper Award</strong>, IEEE ICCBD+AI</li>
  <li><span class="award-year">2023</span> <strong>3rd Place Winner</strong>, Singapore AI Health Summit Poster Competition</li>
</ul>

# 📚 Book Reading

<div class="book-container">
  <div class="book-item">
    <a href="https://en.wikipedia.org/wiki/The_House_on_the_Borderland"><img src="https://img.erpweb.eu.org/imgs/2025/05/41a06bab3300e89d.jpg" class="book-cover"></a>
    <br>Borderland
  </div>
  <div class="book-item">
    <a href="https://en.wikipedia.org/wiki/Flatland"><img src="https://img.erpweb.eu.org/imgs/2025/06/8361c5333a48077c.jpg" class="book-cover"></a>
    <br>Flatland
  </div>
  <div class="book-item">
    <a href="https://www.goodreads.com/book/show/32450412-holy-mother"><img src="https://img.erpweb.eu.org/imgs/2025/07/1356a6d968539bc6.jpg" class="book-cover"></a>
    <br>Holy Mother
  </div>
  <div class="book-item">
    <a href="https://en.wikipedia.org/wiki/House_of_Leaves"><img src="https://img.erpweb.eu.org/imgs/2025/08/d26952946e28064d.jpg" class="book-cover"></a>
    <br>House of Leaves
  </div>
  <div class="book-item">
    <a href="https://en.wikipedia.org/wiki/Before_I_Go_to_Sleep"><img src="https://img.erpweb.eu.org/imgs/2025/09/7413e3991d17211d.jpg" class="book-cover"></a>
    <br>Before I Sleep
  </div>
    <div class="book-item">
    <a href="https://www.amazon.com/Builders-Daniel-Polansky/dp/0765385309"><img src="https://img.erpweb.eu.org/imgs/2025/12/81f79062555c9793.jpg" class="book-cover"></a>
    <br>The Builders
  </div>
</div>

# 🔗 Links
*   **BIRTHLab**: [Brain Imaging Research at Tsinghua](https://birthlab.github.io/)
*   **Collaborators**: 
    [Haoxiang Li](https://lihaoxiang-20.github.io/) / 
    [Jack Tang](https://mcjacktang.github.io/) / 
    [Yunkang Cao](https://caoyunkang.github.io/) / 
    [Yiming Huang](https://yiyihum.github.io/) / 
    [Siwei Li](https://hplqaq.github.io/) / 
    [Yifei Chen](https://justlfc03.github.io/) / 
    [Yingqi Hao](https://yingqihao2022.github.io/) / 
    [Jialan Zheng](https://zjl21.github.io/) / 
    [Xuguang Bai](https://jasonw375.github.io/) / 
    [Yijin Li](https://liyijin6815.github.io/)
