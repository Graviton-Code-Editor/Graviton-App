function retrieveButton(section){
    const button = puffin.element(
        `
          <div id="load_more_plugins" class="extension_div static" >
              <button click="$loadMe" class="center button1" > Load more</button>
          </div>
            `,
        {
          methods: [
            function loadMe() {
              Market.loadMoreExtensions(current_plugins,function(){
                  document.getElementById(`sec_${section}`).innerHTML = '';
                  Market.navigate(section,"force")
              }); 
            }
          ]
        }
      );
      return button
}


module.exports = retrieveButton;
