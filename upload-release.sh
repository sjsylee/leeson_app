#!/bin/bash
set -e

TAG=$1
PROJECT="leeson_app"
REPO="sjsylee/${PROJECT}"
DIST="dist"
VERSION="${TAG#v}"
PLATFORM=""
PLATFORM_LABEL=""

# 플랫폼 감지 및 파일 경로 설정
case "$(uname -s)" in
  Darwin)
    PLATFORM="mac"
    FILES=(
      "$DIST/${PROJECT}-${VERSION}-arm64-mac.zip"
      "$DIST/${PROJECT}-${VERSION}-arm64-mac.zip.blockmap"
      "$DIST/${PROJECT}-${VERSION}-arm64.dmg"
      "$DIST/${PROJECT}-${VERSION}-arm64.dmg.blockmap"
      "$DIST/latest-mac.yml"
    )
    ;;
  MINGW*|MSYS*|CYGWIN*|Windows_NT)
    PLATFORM="win"
    FILES=(
      "$DIST/${PROJECT}-${VERSION}-win.zip"
      "$DIST/${PROJECT}-${VERSION}-Setup.exe"
      "$DIST/${PROJECT}-${VERSION}-Setup.exe.blockmap"
      "$DIST/latest.yml"
    )
    ;;
  *)
    echo "❌ Unsupported platform: $(uname -s)"
    exit 1
    ;;
esac

# 대문자 변환 (bash 호환성 문제 해결)
PLATFORM_LABEL=$(echo "$PLATFORM" | tr '[:lower:]' '[:upper:]')

echo "📦 Detected platform: $PLATFORM"

# 파일 존재 여부 확인
for file in "${FILES[@]}"; do
  if [ ! -f "$file" ]; then
    echo "❌ 파일 없음: $file"
    exit 1
  fi
done

# 릴리즈 존재 여부 확인 후 처리
if gh release view "$TAG" --repo "$REPO" > /dev/null 2>&1; then
  echo "🔄 Uploading to existing release $TAG..."
  gh release upload "$TAG" "${FILES[@]}" \
    --repo "$REPO" --clobber
else
  echo "🚀 Creating new release $TAG..."
  gh release create "$TAG" "${FILES[@]}" \
    --repo "$REPO" --title "$TAG" --notes "$PLATFORM_LABEL release $TAG"
fi
