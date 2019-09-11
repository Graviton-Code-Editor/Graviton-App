module.exports = {
  elasticContainerComponent: class extends HTMLElement {
    constructor() {
      super();
    }
    connectedCallback() {
      const container = this;
      container.id = "elastic" + Math.random();
      const related = (function() {
        if (
          container.getAttribute("related") == "parent" ||
          container.getAttribute("related") == undefined
        ) {
          return container.parentElement;
        }
        if (container.getAttribute("related") == "child") {
          return container.children[0];
        }
        if (container.getAttribute("related") == "self") {
          return container;
        }
      })();
      const direction = (function() {
        if (
          container.getAttribute("direction") == "vertical" ||
          container.getAttribute("direction") == undefined
        ) {
          return "vertical";
        } else {
          return "horizontal";
        }
      })();
      const el = this.parentElement;
      el.onscroll = function() {
        if (direction === "vertical") {
          if (Number(el.getAttribute("toleft")) != el.scrollLeft) return;
          el.setAttribute("toleft", el.scrollLeft);
        } else {
          if (Number(el.getAttribute("toup")) != el.scrollTop) return;
          el.setAttribute("toup", el.scrollTop);
        }

        if (current_config.bouncePreferences == "desactivated") return;
        if (related == null || related == undefined) {
          return;
        }
        if (related.id != undefined) {
          if (document.getElementById(related.id) == undefined) {
            return;
          }
        }
        if (direction === "vertical") {
          if (el.scrollTop == 0) {
            const spacer = document.createElement("div");
            spacer.classList.add("bounce_top");
            this.insertBefore(spacer, this.children[0]);
            setTimeout(function() {
              spacer.remove();
            }, 360);
          }
          if (el.scrollHeight - 1 <= el.scrollTop + el.clientHeight) {
            if (
              document.getElementsByClassName("bounce_bottom").length != 0 ||
              related == null
            )
              return;
            const spacer = document.createElement("div");
            spacer.classList.add("bounce_bottom");
            this.appendChild(spacer);
            setTimeout(function() {
              spacer.remove();
            }, 360);
          }
        } else {
          if (el.scrollLeft == 0) {
            const spacer = document.createElement("div");
            spacer.classList.add("bounce_left");
            this.insertBefore(spacer, this.children[0]);
            setTimeout(function() {
              spacer.remove();
            }, 360);
          }
          if (el.scrollWidth - 1 <= el.scrollLeft + el.clientWidth) {
            if (
              document.getElementsByClassName("bounce_right").length != 0 ||
              related == null
            )
              return;
            const spacer = document.createElement("div");
            spacer.classList.add("bounce_right");
            this.appendChild(spacer);
            setTimeout(function() {
              spacer.remove();
            }, 360);
          }
        }
      };
    }
  },
  elasticContainer: {
    append: function(el, direction = "vertical") {
      el.onscroll = function() {
        if (current_config.bouncePreferences == "desactivated") return;
        if (direction === "vertical") {
          if (Number(el.getAttribute("toleft")) != el.scrollLeft) return;
          el.setAttribute("toleft", el.scrollLeft);

          if (el.scrollTop >= 0 && el.scrollTop < 1) {
            const spacer = document.createElement("div");
            spacer.classList.add("bounce_top");
            this.insertBefore(spacer, this.children[0]);
            setTimeout(function() {
              spacer.remove();
            }, 360);
          }
          if (el.scrollHeight - 1 <= el.scrollTop + el.clientHeight) {
            if (document.getElementsByClassName("bounce_bottom").length != 0)
              return;
            const spacer = document.createElement("div");
            spacer.classList.add("bounce_bottom");
            this.appendChild(spacer);
            setTimeout(function() {
              spacer.remove();
            }, 360);
          }
        } else {
          if (Number(el.getAttribute("totop")) != el.scrollTop) return;
          el.setAttribute("totop", el.scrollTop);

          if (el.scrollLeft >= 0 && el.scrollLeft < 1) {
            const spacer = document.createElement("div");
            spacer.classList.add("bounce_left");
            this.insertBefore(spacer, this.children[0]);
            setTimeout(function() {
              spacer.remove();
            }, 360);
          }
          if (el.scrollWidth - 1 <= el.scrollLeft + el.scrollWidth) {
            if (document.getElementsByClassName("bounce_right").length != 0)
              return;
            const spacer = document.createElement("div");
            spacer.classList.add("bounce_right");
            this.appendChild(spacer);
            setTimeout(function() {
              spacer.remove();
            }, 360);
          }
        }
      };
    }
  }
};
