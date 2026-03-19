window.MathJax = {
  tex: {
    tags: "none",
    inlineMath: [
      ["$", "$"],
      ["\\(", "\\)"],
    ],
  },
  chtml: {
    displayAlign: "center",
  },
  options: {
    renderActions: {
      addCss: [
        200,
        function (doc) {
          const style = document.createElement("style");
          style.innerHTML = `
          .mjx-container {
            color: inherit;
          }
          mjx-mtd[style*="width"] {
            display: none !important;
          }
        `;
          document.head.appendChild(style);
        },
        "",
      ],
    },
  },
};
