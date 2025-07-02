#!/bin/bash

# ustaw zmienną środowiskową globalnie na czas budowania
export openssl_fips=""

# uruchom oryginalny skrypt macos
npm run macos:inner

