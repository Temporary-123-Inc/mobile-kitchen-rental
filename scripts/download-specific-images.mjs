import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const groups = {
  "mobile-kitchens/26ft-baby-bulk": [
    ["1Cp_rgnNF-sNl4MoeuPXOsuqq22F27DiP", "26ft-baby-bulk-kitchen-tilting-skillet.png"],
    ["1Iptz4NmJYpjqBA6VRNDcrSvZrX7bXjVe", "26ft-baby-bulk-kitchen-hand-wash-sink.png"],
    ["1-3y3gFAV0SxW7Io-mbA5WjWnuc4kiAOA", "26ft-baby-bulk-kitchen-three-compartment-sink.png"],
    ["1Cjf89r5ZgFodiTeiayxOeH48fKN1J463", "26ft-baby-bulk-kitchen-commercial-oven.png"],
    ["1ICb6Rvuk2fQniudM6NwT4PE3MZCoHLcw", "26ft-baby-bulk-kitchen-commercial-refrigerator.png"],
    ["1sd84a4Ux0YrjCppmF5Oj8C3X_yWwMdnX", "26ft-baby-bulk-kitchen-storage-rack.png"],
    ["1NZZ04bkKCPoHmilUPZHn5h2W8JoLbex4", "26ft-baby-bulk-kitchen-trailer-interior.png"],
    ["1jfhQDX0xU22gjD4CNUoHoXzbmaLboxYt", "26ft-baby-bulk-kitchen-griddle-cooking-line-a.png"],
    ["1rTePO0iMrrwro9zyVbxqkasySLYlny1T", "26ft-baby-bulk-kitchen-griddle-cooking-line-b.png"],
    ["1ePzIj17P2346y5BcRoHwca7HQSuujbwr", "26ft-baby-bulk-kitchen-commercial-fryers.png"],
    ["1qt_XbD775v48F3X1oN-QAPNgIpcnH7FA", "26ft-baby-bulk-kitchen-trailer-entrance.png"],
  ],
  "refrigerated-trailers-and-containers/12ft-refrigerated-trailer-tier-1-4": [
    ["1arfOfiZDdgnPC3tTbkqxgkz_EDHNqCqh", "12ft-refrigerated-trailer-refrigeration-unit.png"],
    ["1w6znw9ShvYGeALRXQwYu6RblLqeOxB-E", "12ft-refrigerated-trailer-stainless-steel-interior.png"],
    ["15dWNj7Ldj7vxx2B12rpDJmCYQ-saO5uI", "12ft-refrigerated-trailer-interior-cooling-system.png"],
    ["1q9CFt8J01nn84ZHmc8bOseIkSS_atay2", "12ft-refrigerated-trailer-exterior.png"],
  ],
  "refrigerated-trailers-and-containers/20ft-refrigerated-container-tier-1-4": [
    ["1-oczLktw7bytWt1vXGksRdo8Cow59oKe", "20ft-refrigerated-container-interior-cooling-unit.png"],
    ["1E1WI_gqcWQl6KweeIrUKuOdZQWLxYipF", "20ft-refrigerated-container-cold-storage-interior.png"],
    ["1SEfXLQcrsv5t4t7vwB3T6TIx2sWJTFOx", "20ft-refrigerated-container-interior.png"],
  ],
  "laundry-trailers-and-containers/24ft-laundry-trailer": [
    ["1870eFUS-d77jWvqq7vgabI-Y8C3rh_Vd", "24ft-temporary-laundry-trailer-interior.png"],
    ["1MR_GfzsePU0AZMlYZzTdqlgAuLn1R6Mo", "24ft-commercial-laundry-trailer-washing-machines.png"],
    ["15Ra1jzX-Laper9niODEiAbuPIo_0o7uq", "24ft-mobile-laundry-trailer-washer-dryer-interior.png"],
  ],
  "luxury-shower-restroom-combination-trailers/30ft-10-stall": [
    ["1F8AnK5kDXQqjn2EEwr4rGMeyclizWsQn", "30ft-temporary-shower-restroom-trailer-interior.png"],
    ["1IRrdVTIzeBbaFkAPTstqHFVJdih9G_cC", "30ft-mobile-luxury-shower-restroom-trailer.png"],
    ["1_DPUKAQkPHz9Xs2iwGUjp0e2hyMipQGY", "30ft-commercial-luxury-shower-restroom-trailer-interior.png"],
  ],
  "luxury-shower-restroom-combination-trailers/8-stall-1-ada": [
    ["1_YszqW6rjgewVq0L2PJ84utljqC4t9sl", "8-stall-ada-shower-restroom-trailer-exterior.png"],
    ["1rX8eIrCcJtXZn1xKze34j1AO2ZEc6lkL", "luxury-shower-restroom-combination-trailer-side-view.png"],
    ["1IkS1UiTu3MuCBdWMHgmNbt28pKnHti6g", "ada-accessible-shower-restroom-trailer.png"],
    ["1UKN_vmcIte5p_CYFpqwXtQNmWjcsE0Ev", "ada-shower-restroom-trailer-interior.png"],
    ["1rj-_rU2seQ1-J-eCh86SlWb4CXHfI1Kw", "8-stall-ada-restroom-shower-trailer-entrance.png"],
    ["1DFVOeYcmxaXBQxPlMvR2PgstpYNuNGSp", "luxury-shower-restroom-trailer-rear-view.png"],
    ["1wSKzcOcKRIqoRhY52PlgEKOJ2G4UPcOH", "8-stall-shower-restroom-combination-trailer-exterior.png"],
    ["1aawm5gHpJt177FGaS6YJbIYRnR6sNCoD", "luxury-restroom-shower-trailer-sink-area.png"],
    ["1MGR7WQgmd7M8llrGgyA2KBEGI94qnwhV", "8-stall-ada-shower-restroom-trailer-interior.png"],
    ["1s8vEVF4MwKBE3bx5e-o65v_PAA-m7pEz", "luxury-shower-restroom-trailer-shower-stall.png"],
    ["1JQzUm13j1d-OblxVdZkxBlETcLjYd6-L", "luxury-shower-restroom-combination-trailer-interior.png"],
  ],
  "restroom-trailers/restroom-trailer": [
    ["1r5-6USyN0FBE0vOtHLJoMCIh4BklsQYQ", "commercial-mobile-restroom-trailer-sink-interior.png"],
    ["1WvQ5qESJZT13ciuw6Xpb9vjzV2X8Gdn9", "commercial-mobile-restroom-trailer-interior.png"],
    ["1wEwo4WrwxIMkUwS9--yN9ad12T-XIue6", "temporary-restroom-trailer-urinal-and-sink.png"],
  ],
};

const outputRoot = path.resolve("public/media/equipment-drive");
for (const [group, files] of Object.entries(groups)) {
  const destination = path.join(outputRoot, group);
  await mkdir(destination, { recursive: true });
  await Promise.all(files.map(async ([id, name]) => {
    const url = `https://drive.usercontent.google.com/download?id=${id}&export=download&confirm=t`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`${name}: ${response.status} ${response.statusText}`);
    await writeFile(path.join(destination, name), Buffer.from(await response.arrayBuffer()));
  }));
  console.log(`${group}: ${files.length}`);
}
