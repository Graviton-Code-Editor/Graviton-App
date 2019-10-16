/*
########################################
              MIT License

Copyright (c) 2019 Marc Espin Sanz

License > https://github.com/Graviton-Code-Editor/Graviton-App/blob/master/LICENSE.md

#########################################
*/

/*
new Control({
  text:"Some text",
  hint:"Something"
})
*/

module.exports = {
  Control: function ({ text, hint, screen = current_screen.id }) {
    this.text = text
    this.hint = hint
    this.screen = screen;
    const controlSpan = document.createElement('span')
    controlSpan.innerText = text
    if (hint != undefined) controlSpan.title = hint
    document
      .getElementById(this.screen)
      .children[2].appendChild(controlSpan)
    this.setText = newText => {
      controlSpan.innerText = newText
    }
    this.setHint = newHint => {
      controlSpan.title = newHint
    }
    this.hide = () => {
      controlSpan.style.display = 'none'
    }
    this.show = () => {
      controlSpan.style.display = 'block'
    }
  }
}
