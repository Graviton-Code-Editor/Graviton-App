module.exports = {
  elasticContainerComponent: class extends HTMLElement {
    constructor () {
      super()
    }
    connectedCallback () {
      const container = this
      container.id = 'elastic' + Math.random()
      const related = (function () {
        if (container.getAttribute('related') == 'parent' || container.getAttribute('related') == undefined) {
          return container.parentElement
        }
        if (container.getAttribute('related') == 'child') {
          return container.children[0]
        }
        if (container.getAttribute('related') == 'self') {
          return container
        }
      })()
      const el = this.parentElement
      el.onscroll = function () {
        if (Number(el.getAttribute('toleft')) != el.scrollLeft) return
        el.setAttribute('toleft', el.scrollLeft)
        if (current_config.bouncePreferences == 'desactivated') return
        if (related == null || related == undefined) {
          return
        }
        if (related.id != undefined) {
          if (document.getElementById(related.id) == undefined) {
            return
          }
        }
        if (el.scrollTop == 0) {
          const spacer = document.createElement('div')
          spacer.classList.add('bounce_top')
          this.insertBefore(spacer, this.children[0])
          setTimeout(function () {
            spacer.remove()
          }, 360)
        }
        if (el.scrollHeight - 1 <= el.scrollTop + el.clientHeight) {
          if (document.getElementsByClassName('bounce_bottom').length != 0 || related == null) return
          const spacer = document.createElement('div')
          spacer.classList.add('bounce_bottom')
          this.appendChild(spacer)
          setTimeout(function () {
            spacer.remove()
          }, 360)
        }
      }
    }
  },
  elasticContainer: {
    append: function (el) {
      el.onscroll = function () {
        if (Number(el.getAttribute('toleft')) != el.scrollLeft) return
        el.setAttribute('toleft', el.scrollLeft)
        if (current_config.bouncePreferences == 'desactivated') return
        if (el.scrollTop >= 0 && el.scrollTop < 1) {
          const spacer = document.createElement('div')
          spacer.classList.add('bounce_top')
          this.insertBefore(spacer, this.children[0])
          setTimeout(function () {
            spacer.remove()
          }, 360)
        }
        if (el.scrollHeight - 1 <= el.scrollTop + el.clientHeight) {
          if (document.getElementsByClassName('bounce_bottom').length != 0) return
          const spacer = document.createElement('div')
          spacer.classList.add('bounce_bottom')
          this.appendChild(spacer)
          setTimeout(function () {
            spacer.remove()
          }, 360)
        }
      }
    }
  }
}
