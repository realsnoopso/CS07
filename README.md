# 체크리스트

- [ ] 문장 단위 XML 파싱
      // '<'와'>' 사이에 있는 글자 가져오기
      // '>'와'<' 사이에 있는 글자 가져오기
      // '</'와'>' 사이에 있는 글자 가져오기

```xml
<price unit="dallor">29.99</price>
```

- [ ] parent가 포함된 XML 파싱

```xml
<book category="cooking">
    <title lang="en">Everyday Italian</title>
    <author>Giada De Laurentiis</author>
    <year>2005</year>
    <price>30.00</price>
  </book>
```

- [ ] html 구조 XML 파싱

```
<!DOCTYPE html>
<HTML lang="ko">
  <BODY>
    <P>
      BOOST
      <IMG SRC=\"codesquad.kr\"></IMG>
      <BR/>
    </P>
  </BODY>
</HTML>
"
```

- [ ] iOS Info.plist XML 파싱

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
  <dict>
    <key>CFBundleDevelopmentRegion</key>
    <string>$(DEVELOPMENT_LANGUAGE)</string>
    <key>CFBundleExecutable</key>
    <string>boost</string>
    <key>CFBundleName</key>
    <string>camp</string>
  </dict>
</plist>
```

- [ ] 에러케이스 대응

```xml
<!DOCTYPE html>
  <HTML lang="ko">
    <BODY>
  </HTML>
    </BODY>

//ERROR: "올바른 XML 형식이 아닙니다."
```
