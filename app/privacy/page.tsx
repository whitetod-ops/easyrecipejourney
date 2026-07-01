export const metadata = {
  title: 'Privacy Policy — Easy Recipe Journey',
};

export default function PrivacyPage() {
  const year = new Date().getFullYear();
  return (
    <div style={{ background: '#F8F4EF', padding: '4rem 1.5rem' }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <h1 style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: '2rem',
          fontWeight: 600, color: '#2C2018', marginBottom: 8 }}>Privacy Policy</h1>
        <p style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontSize: 13,
          color: '#9A8070', marginBottom: 32 }}>Last updated: January {year}</p>

        {[
          ['Information we collect',
            'We collect information you provide directly (such as an email address if you sign up for our newsletter) and information collected automatically via analytics tools, including pages visited, time on site, and general geographic region. We do not collect your name, address, or payment information.'],
          ['How we use it',
            'We use analytics data to understand how visitors use the site and to improve the content and experience. If you subscribe to our newsletter, we use your email address solely to send recipe updates. We do not sell or share your personal data with third parties for marketing purposes.'],
          ['Cookies and advertising',
            'We use cookies for analytics (Google Analytics 4) and, if enabled, for display advertising through Google AdSense or similar networks. These services may use cookies to serve ads relevant to your interests. You can opt out of personalised advertising at g.co/adsettings.'],
          ['Third-party links',
            'Some recipe pages may contain affiliate links to products on Amazon or other retailers. We may earn a small commission if you make a purchase through these links, at no extra cost to you. These links are clearly used to support the site.'],
          ['Data retention',
            'Analytics data is retained in accordance with Google\'s standard data retention policies. Newsletter subscriber data is held until you unsubscribe.'],
          ['Your rights',
            'You may request deletion of any personal data we hold about you by contacting us directly. If you are located in the EU or UK, you have additional rights under GDPR/UK GDPR, including the right to access, correct, and erase your data.'],
          ['Contact',
            'For any privacy-related questions, please contact us through the About page. We will respond within a reasonable timeframe.'],
        ].map(([title, body]) => (
          <div key={title} style={{ marginBottom: 28 }}>
            <h2 style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: 17,
              fontWeight: 600, color: '#2C2018', marginBottom: 8 }}>{title}</h2>
            <p style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontSize: 14,
              color: '#6B5040', lineHeight: 1.8, margin: 0 }}>{body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
