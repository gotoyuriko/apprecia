import AppreciaView from '@/components/AppreciaView';
import Navbar from '../components/Nav/Navbar';
import { auth } from '@/firebase/config';
import { useEffect, useState } from 'react';

export default function Home() {
  const user = auth.currentUser;
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // OpenGL関数の呼び出し
    const textureID = glGenTextures(1);

    // エラーチェック
    const error = glGetError();
    if (error !== GL_NO_ERROR) {
      console.error('OpenGLエラーが発生しました:', getErrorMessage(error));
    }

    // 他のOpenGL関数の呼び出しや追加の処理を行うことができます

    // コンポーネントがアンマウントされたときにOpenGLリソースを解放する必要がある場合は、クリーンアップ関数を返します
    return () => {
      // OpenGLリソースの解放などのクリーンアップ処理を行うことができます
    };
  }, []);

  return (
    <div className="w-full">
      <Navbar user={user} />
      <main className="flex h-96 w-full flex-col items-center justify-center bg-fixed bg-center bg-cover bg-repeat">
        {!isLoaded && (
          <div
            onLoad={() => setIsLoaded(true)}
            style={{
              width: '100%',
              position: 'relative',
              zIndex: 0,
              background: 'url(/appreciabg.png)',
              backgroundPosition: 'center',
              backgroundSize: 'cover',
              backgroundRepeat: 'none'
            }}
          />
        )}
        <AppreciaView className="h-full w-full" />
      </main>
    </div>
  );
}
