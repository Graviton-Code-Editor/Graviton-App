FROM gitpod/workspace-full-vnc

RUN printf '%s\n' 'debconf debconf/frontend select Noninteractive' | sudo debconf-set-selections && \
    sudo apt-get update && \
    sudo apt-get install -yq libwebkit2gtk-4.0-dev \
      build-essential \
      curl \
      wget \
      libssl-dev \
      libgtk-3-dev \
      libappindicator3-dev \
      patchelf \
      librsvg2-dev


RUN cargo install tauri-cli --git https://github.com/tauri-apps/tauri --branch tmp/pin-clap

RUN npm i yarn -g && yarn

RUN cd extensions/git && cargo build