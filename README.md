# 【実験版】 3D 空間 ID 共通ライブラリ

これは 3D 空間 ID の共通ライブラリの JavaScript 版のプロトタイプです。

### 概要

このライブラリは位置情報と空間 ID を相互変換したり操作するための共通ライブラリとして利用されるべき機能を提供します。

コンストラクタである `Space()` に対して、座標及び高度、または空間 ID を引数として渡して実行すると、空間オブジェクトを生成します。

空間オブジェクトは以下のプロパティを持っており、空間を移動するためのいくつかのメソッドも提供します。

* 中心点の緯度及び経度
* 高度
* ズームレベル（分解能）
* ZFXY（3次元タイル番号）
* タイルハッシュ（3次元タイル番号をハッシュ化した値）

メソッドについては以下のリンク先をご参照ください。

https://github.com/spatial-id/spatial-object-model-specification#readme

デフォルトではグローバル空間（WGS84, EPSG:4326）のベースとした座標系を利用しますが、任意の座標系を使うこともできます。任意の座標系を利用する場合は、「グローバル座標系以外の使い方」を参照してください。

## インストール方法

```
$ npm install https://github.com/spatial-id/javascript-sdk -S
```

## モジュールのロード

以下の方法でモジュールを読み込んでください。

```
import { Space } from '@spatial-id/javascript-sdk'
```

## コンストラクタ

```
Space( input, zoom? )
```

新しい空間オブジェクトを返します。

### 引数

#### input

座標及び高度または空間 ID を以下のフォーマットで指定することができます。

* LngLatWithAltitude: 緯度経度及び高度を含むオブジェクト。（例: `{ lng: number, lat: number, alt?: number }`）
* XYZ: 直交座標系（デカルト座標系）で座標を指定するオブジェクト。EPSG:4326 (WGS84 / GPS緯度経度) を使う場合、`x` が経度、 `y` 緯度、 `z` 高度（メートル）で指定します。(例: `{ x: number, y: number, z?: number }`)
* ZFXYTile: ZFXY（3次元タイル番号）を示す文字列。（例: `/15/6/2844/17952`）
* TileHash: ZFXY をハッシュ化した値。（例: `100213200122640`）

#### zoom

ズームレベル（分解能）を整数で指定することができます。

この引数は省略も可能で、デフォルトは `25` です。

## 補助コンストラクタ

```
Space.boundingSpaceForGeometry( geometry, minZoom? )
```

`geometry` に渡された GeoJSON の Geometry オブジェクトに対して、最小分解能（ズームレベル）での空間IDを返す。
`minZoom` が指定している場合は、より少ない分解能（ズームレベル）の空間IDが作られるにしても、 `minZoom` での空間IDを返す。

```
Space.spacesForGeometry( geometry, zoom )
```

`geometry` に渡された GeoJSON の Geometry オブジェクトに対して、その Geometry と指定の `zoom` での分解能（ズームレベル）の空間IDの共通集合を配列として返す。

## メソッド

このライブラリは [Spatial Object Model](https://github.com/spatial-id/spatial-object-model-specification#readme) を参照に実装しています。

`Space` のメソッドのドキュメンテーションは下記となります。

### `.center`

* 現在の空間オブジェクトの中央点 (3Dの `{lng: number, lat: number, alt: number}` 型)

### `.alt`

* 現在の空間オブジェクトの最低高さ (floor)

### `.zoom`

* 現在の空間オブジェクトのズームレベル（分解能）

### `.zfxy`

* 現在の空間オブジェクトが表現している ZFXY を ZFXYTile 型 (`{ z: number, f: number, x: number, y: number }`)

### `.id`, `.tilehash`

* 現在の空間オブジェクトが表現している ZFXY の tilehash の文字列

### `.zfxyStr`

* 現在の空間オブジェクトが表現している ZFXY を URL のパス型に変換したもの

### `.up(by?: number)`

![up](https://user-images.githubusercontent.com/309946/168220328-47e09300-c4dc-4ad1-adae-2cb17aff23ab.png)

* パラメータがない場合は、現在の空間オブジェクトのひとつ上の空間オブジェクトを返す
* パラメータが指定されている場合は、その個数分の空間オブジェクトを配列で返す

### `.down(by?: number)`

![down](https://user-images.githubusercontent.com/309946/168220818-f89a73b1-b99c-462d-9fcb-5eae0eac03eb.png)

* パラメータがない場合は現在の空間オブジェクトのひとつ下の空間オブジェクトを返す
* パラメータが指定されている場合は、その個数分の空間オブジェクトを配列で返す

### `.north(by?: number), .east(by?: number), south(by?: number), .west(by?: number)`

![north](https://user-images.githubusercontent.com/309946/168221234-b03809ef-6c69-442b-98d3-583b4391108e.png)

* パラメータがない場合は、現在の空間オブジェクトの隣のオブジェクトを返す
* パラメータが指定されている場合は、その個数分の空間オブジェクトを配列で返す

### `.move(by: Partial<Omit<ZFXYTile, 'z'>>)`

* 現在の空間オブジェクトから相対的な新しいオブジェクトを返す。 `by` は少なくとも `x, y, f` の一つ以上を含めてください

```
space.move({x: 1, y: 5, f: -1})
```

上記の例の場合では、返り値は西1マス、北5マス、下1マスにある空間オブジェクト

### `.surroundings()`

![surroundings](https://user-images.githubusercontent.com/309946/168221371-b1ec30c7-f501-4a6b-ad64-5a6345fb9665.png)

* 現在の空間オブジェクトのまわりにあるすべての空間オブジェクトを配列で返す。

### `.parent(atZoom?: number)`

* 現在の空間オブジェクトから、分解能（ズームレベル）を `atZoom` のズームレベルまで下げる。デフォルトでは1段階下げます。

### `.children()`

* 現在の空間オブジェクトから、分解能（ズームレベル）を一つ上げて、そこに含まれるすべての空間オブジェクトを返す。

### `.contains()`

* 指定された緯度経度が、指定されたボクセル内に含まれるかどうかを判定して bool 値を返す。

### `.vertices3d()`

* 現在の空間オブジェクトの3Dバウンディングボックスを作る8点の座標を配列として返す。

# グローバル座標系以外の使い方

`CRS` を使って、カスタムな座標系を作ることができます。
`CRS` を使う場合は、指定の EPSG CRS の単位によってx/y/zの単位が決まります。例えば、EPSG:6670の平面直角座標系2系の単位はメートルなので、x/y/zの値はすべてメートルとなります。単位が「度」の場合は、x/yが度として解釈し、z (f) はメートルと解釈します。

```
import { CRS } from '@spatial-id/javascript-sdk'
const crs = CRS.fromEPSG('6670') // EPSG:6670 は平面直角座標系2系
const space = new crs.Space({ x: 1, y: 1, z: 1 }, 25)
```

以降、`space` は上記と同様な動作を利用できます。

## EPSG以外の任意座標系の使い方（ローカル空間ID）

下記の例は、基準点を持たない座標系となります。

座標系の作成に、下記の２方法あります。

* `CRS.fromCustomTargetSize` を使うと、指定のズームレベルでの空間IDの大きさを指定して空間を作ります。
* 一方、 `CRS.fromCustomTargetSize` は空間の全体の大きさを指定して空間を作ります。

```
import { CRS } from '@spatial-id/javascript-sdk'

// 指定のズームでのタイルサイズを指定する（3軸同一値を利用する）
const crs = CRS.fromCustomTargetSize({ size: 1, atZoom: 25 })
// 指定のズームでのタイルサイズを指定する（それぞれの軸を利用する）
const crs = CRS.fromCustomTargetSize({ x: 1, y: 1, z: 1, atZoom: 25 })

// 全体範囲を指定する（3軸を同一値を利用する）
const crs = CRS.fromCustomExtents({ min: -10, max: 10, units: '' })
// 全体範囲を指定する（それぞれの軸を利用する - [x, y, z] の順）
const crs = CRS.fromCustomExtents({ min: [-10, -10, 0], max: [10, 10, 20] })

const space = new crs.Space({ x: 1, y: 1, z: 1 }, 25)
```

基準点を持たない座標系に基準点を設定できます。（デフォルトで EPSG:4326になります）

```
crs.setOrigin({longitude: number, latitude: number, altitude: number, angle: number}, epsg?: string)
```

## 座標系変換

あるCRSから別のCRSのSpaceに変換することもできます

```
import { CRS } from '@spatial-id/javascript-sdk'
const crs2K = CRS.fromEPSG('6670') // EPSG:6670 は平面直角座標系2系
const space = new crs.Space({ x: 1, y: 1, z: 1 }, 25)

const crsWGS = CRS.fromEPSG('4326')
const wgsSpace = space.spaceInCRS(crsWGS)
const wgsGeoJSON = space.geoJsonInCRS(crsWGS)
```

基準点を持たない座標系から基準点を設定し、変換行います。基準点が無い場合、エラーとなります。

```
import { CRS } from '@spatial-id/javascript-sdk'
const crs = CRS.fromCustomTargetSize({ size: 1, atZoom: 25, unit: 'm' }) // Z25で1タイルが3軸とも1m
const space = new crs.Space({ x: 0, y: 0, z: 0 }, 25)

const crsWGS = CRS.fromEPSG('4326')
const wgsSpace = space.spaceInCRS(crsWGS)
const wgsGeoJSON = space.geoJsonInCRS(crsWGS)
```
