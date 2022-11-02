self.addEventListener('install', function(e) {
 e.waitUntil(
   caches.open('stickman-cache').then(function(cache) {
     return cache.addAll([
        'index.html',
        'bundle.js',
        'poki.js',
        'fonts/JUNEGULL.ttf',
        'fonts/Odin-Rounded-Bold.ttf',
        'images/01434c96a36c2c33d787073809c13b8b-CHAR_SuperStick_Miniature.png',
        'images/03b7dd5d1ae7134731c278c21bb06289-CHAR_EvilStick.png',
        'images/040f73e99e3473c54f2c9a9f1d88ec9f-CHAR_HotDog_Miniature.png',
        'images/04184d3d7203cb3de14a0a404a84bf97-CHAR_Classic_Miniature.png',
        'images/1635fd44544c14a10472da2ec5d39197-madbox_blackBG.png',
        'images/1f8794216bbd48e1185deeeafd38e37f-CHAR_AngelStick.png',
        'images/27f62cb7fcc15256d379f7e940d7fc35-titlepow2.png',
        'images/28506e14838e4d45f80d079fe1d2b110-CHAR_Unicorn_Miniature.png',
        'images/2c29c41a85e52e34092591b37aaaa278-CHAR_Sheep.png',
        'images/2d47eed71e4381405080714e00ec6ad9-CHAR_EvilStick_Miniature.png',
        'images/325db0a37f265c4934bbe2dd1e2f3d3f-CHAR_KingStick.png',
        'images/34b2b8621726d53802db6f864b49cd90-CHAR_TikiMan.png',
        'images/368f37cb016283b9e9dee8c14fab9ad4-CHAR_Plant.png',
        'images/3a44cbb3a12ca246c94cc8a421f62a9a-CHAR_Banana_Miniature.png',
        'images/3de7d310811b58b61509ccdbc6d52797-CHAR_Ninja.png',
        'images/3e903b257d861f09cba9b42a601309c2-CHAR_Classic.png',
        'images/3f8e3b577ebcb0720aa183ffa614f39f-CHAR_StickOuech_Miniature.png',
        'images/42d5a0d39256b37cf6708139269f3c03-CHAR_Momie_Miniature.png',
        'images/43373af2c85cc40390455124c8916b67-BumperLarge.png',
        'images/44c268a5c1540584f0d010b1c5ef9a7d-CHAR_TikiMan_Miniature.png',
        'images/48b008015901097a88b7803f4ad868da-title.png',
        'images/49e3dae36bca650873d849bb87b3890b-CHAR_SuperStick.png',
        'images/4ad6740ee1c9057ba7ed74460be8950a-CHAR_RobotMan_Miniature.png',
        'images/4f337cbf23b4fd91307352b5f9a2d5de-CHAR_LemonMan.png',
        'images/50a9bb3e272fc5be76bc8968f704e959-FinishPlatform.png',
        'images/54e99c08dfada2fdd1e3b94b699360a4-btn_play.png',
        'images/5eb119962664142b51b839f8ffc53e15-CHAR_RainbowStick.png',
        'images/601a0de398a32bd53366c6fee57ea531-CHAR_Dragon_Miniature.png',
        'images/61f8a43a4891731ae3b68bb41346767f-CHAR_KingStick_Miniature.png',
        'images/77faf6c9730991489534659f010dfa9b-CHAR_Cactus_Miniature.png',
        'images/78696f12a3c6e8ed46cc5184cc505bcb-CHAR_Banana.png',
        'images/7b99e73b8249767bd829cd4c07f9d0ac-CHAR_Burger.png',
        'images/82d481b0f0594b10f47878452ccb3f6e-CHAR_RobotMan.png',
        'images/857eb4f13173bab620d058806de00f44-CHAR_Momie.png',
        'images/8aca225d45e83ac265aec132085a8b71-CHAR_Dragon.png',
        'images/8bcf52d4fa476d7409be921ceabea58b-CHAR_Unicorn.png',
        'images/8c92b88b23a65aece8ad09c9fb12a398-B_PlayButton.png',
        'images/8d8328c8a5f7e4e701d5a1c98ff4660b-CHAR_Corgi.png',
        'images/8e1269876513676187aec62722d9c236-CHAR_RainbowStick_Miniature.png',
        'images/8fa30d5272fb19c67d5e279222f7b794-CHAR_Burger_Miniature.png',
        'images/93b6dcc1155241b085d711c509eaeafa-CHAR_StickPlant.png',
        'images/93ff3fc5d168e31f731739824e0659b3-SHOP_UI0005.png',
        'images/95eae8386a9fa35681d9259a90cfe08e-CHAR_Sheep_Miniature.png',
        'images/a05fd91e4801f756cf9f0dcb4e5517f8-CHAR_Harry_Miniature.png',
        'images/a5940ffe13ef294f944076aa73ef715a-CHAR_StickPlant_Miniature.png',
        'images/b29eb22ba46e706f4964c7becd276ae2-CHAR_Panda.png',
        'images/b5716296e3556e7ba7293148c682d305-CHAR_LemonMan_Miniature.png',
        'images/b6a61ef922faf37de190abe915c17dec-FX_Spawn.png',
        'images/c40aa8ce16dc9ca63a65736aa1123119-CHAR_Ninja_Miniature.png',
        'images/c8266212e222c99b3f36be97519fe984-CHAR_Cactus.png',
        'images/cb00f3da7bca38a121a28feac4b4d9ea-CHAR_HotDog.png',
        'images/dc7ebdf3f8d4dcb71c7a59bbf3d11619-CHAR_StickOuech.png',
        'images/e05408b9bd045ed3e43a969146823019-CHAR_AngelStick_Miniature.png',
        'images/fac3f46ae48d845f47e31b60b8ea3127-CHAR_Plant_Miniature.png',
        'images/fcd3dbdb6348beb40a3122f7eeae8cbd-CHAR_Panda_Miniature.png',
        'preroll/adinGameLoader.js',
        'preroll/adinLoader.js',
        'preroll/jquery.min.js',
        'preroll/style.css',
        'preroll/tag.min.js'
     ]);
   })
 );
});


self.addEventListener('fetch', function(event) {
    event.respondWith(
      caches.match(event.request).then(function(response) {
        return response || fetch(event.request);
      })
    );
   });