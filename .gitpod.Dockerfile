FROM gitpod/workspace-full-vnc

ENV DEBIAN_FRONTEND="noninteractive"

RUN sudo apt update && sudo apt install libwebkit2gtk-4.0-dev \
      build-essential \
      curl \
      wget \
      libssl-dev \
      libgtk-3-dev \
      libappindicator3-dev \
      patchelf \
      librsvg2-dev -y

RUN sudo cargo install tauri-cli --git https://github.com/tauri-apps/tauri --branch tmp/pin-clap

RUN sudo npm i yarn -g && yarn

RUN cd extensions/git && cargo build