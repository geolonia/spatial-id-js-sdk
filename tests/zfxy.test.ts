import * as zfxy from "../src/zfxy";

describe('zfxy', () => {
  describe('getCenterLngLatAlt', () => {
    it('works', () => {
      const center1 = zfxy.getCenterLngLatAlt({z: 25, f: 0, x: 16777216, y: 16777216});
      expect(center1.alt).toStrictEqual(0.5);

      const center2 = zfxy.getCenterLngLatAlt({z: 25, f: 1, x: 16777216, y: 16777216});
      expect(center2.alt).toStrictEqual(1.5);

      const center3 = zfxy.getCenterLngLatAlt({z: 20, f: 0, x: 524288, y: 524288});
      expect(center3.alt).toStrictEqual(16);

      const center4 = zfxy.getCenterLngLatAlt({z: 20, f: 1, x: 524288, y: 524288});
      expect(center4.alt).toStrictEqual(32 + 16);

      const center5 = zfxy.getCenterLngLatAlt({z: 20, f: 10, x: 524288, y: 524288});
      expect(center5.alt).toStrictEqual((32 * 10) + 16);
    });
  });

  describe('getVoxelHeight', () => {
    it('works', () => {
      const height1 = zfxy.getVoxelHeight(25);
      expect(height1).toStrictEqual(1);

      const height2 = zfxy.getVoxelHeight(20);
      expect(height2).toStrictEqual(32);
    });
  });

  describe('getFloor', () => {
    it('works', () => {
      const floor1 = zfxy.getFloor({z: 25, f: 0, x: 16777216, y: 16777216});
      expect(floor1).toStrictEqual(0);

      const floor2 = zfxy.getFloor({z: 25, f: 1, x: 16777216, y: 16777216});
      expect(floor2).toStrictEqual(1);

      const floor3 = zfxy.getFloor({z: 20, f: 0, x: 524288, y: 524288});
      expect(floor3).toStrictEqual(0);

      const floor4 = zfxy.getFloor({z: 20, f: 1, x: 524288, y: 524288});
      expect(floor4).toStrictEqual(32);
    });
  });
});
