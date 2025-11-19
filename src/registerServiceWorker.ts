// Service Worker Registration for MSAR ERP
import { register } from 'register-service-worker';

if (import.meta.env.PROD) {
    register('/sw.js', {
        ready() {
            console.log(
                'نظام PWA جاهز للعمل - Service Worker مفعل\n' +
                'مزيد من المعلومات: https://goo.gl/AFskqB'
            );
        },
        registered() {
            console.log('Service Worker تم تسجيله بنجاح');
        },
        cached() {
            console.log('المحتوى تم تخزينه مؤقتاً للاستخدام دون اتصال');
        },
        updatefound() {
            console.log('يتم تحميل محتوى جديد...');
        },
        updated(registration) {
            console.log('محتوى جديد متاح، يرجى التحديث');
            // إشعار المستخدم بوجود تحديث
            if (confirm('نسخة جديدة متاحة! هل تريد التحديث الآن؟')) {
                if (registration && registration.waiting) {
                    registration.waiting.postMessage({ type: 'SKIP_WAITING' });
                }
                window.location.reload();
            }
        },
        offline() {
            console.log('لا يوجد اتصال بالإنترنت - يعمل التطبيق في وضع عدم الاتصال');
        },
        error(error) {
            console.error('خطأ أثناء تسجيل Service Worker:', error);
        },
    });

    // Handle service worker updates
    let refreshing = false;
    navigator.serviceWorker?.addEventListener('controllerchange', () => {
        if (refreshing) return;
        refreshing = true;
        window.location.reload();
    });
}
