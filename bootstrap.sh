#!/bin/bash

## SERVER CONFIGURATION
echo "install node"
yum -y install wget curl
yum -y install autoconf automake cmake freetype-devel gcc gcc-c++ git libtool make mercurial nasm pkgconfig zlib-devel

curl --silent --location https://rpm.nodesource.com/setup_4.x | bash -
yum -y install nodejs

echo "install emacs git"
yum -y install emacs emacs-common emacs-nox
yum -y install git
