export const metadata = {
  title: 'Terms of Use — Easy Recipe Journey',
};

export default function TermsPage() {
  return (
    <div style={{ background: '#F8F4EF', padding: '4rem 1.5rem' }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <h1 style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: '2rem',
          fontWeight: 600, color: '#2C2018', marginBottom: 8 }}>Terms of Use</h1>
        <p style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontSize: 13,
          color: '#9A8070', marginBottom: 32 }}>Last updated: July 2026</p>

        {[
          ['Use of content',
            'All recipe content, photographs, and written material on Easy Recipe Journey is for personal, non-commercial use. You may not reproduce, republish, or redistribute our content without prior written permission.'],
          ['Recipe disclaimer',
            'Recipes are provided for informational and entertainment purposes only. Always use your own judgment when cooking — particularly regarding food allergies, dietary restrictions, safe food handling, and cooking temperatures. Easy Recipe Journey is not responsible for any adverse outcomes resulting from following recipes on this site.'],
          ['Affiliate links',
            'This site may contain affiliate links to third-party products. We may earn a commission on qualifying purchases at no extra cost to you. We only link to products we believe are genuinely useful.'],
          ['Advertising',
            'This site displays advertising from third-party ad networks. We do not control the content of these ads. If you encounter an ad that seems inappropriate, you may report it through your browser\'s ad feedback tools.'],
          ['Accuracy',
            'We make every effort to ensure recipe accuracy, but we cannot guarantee that all information is current or error-free. If you spot an error, please let us know.'],
          ['Changes to these terms',
            'We may update these terms from time to time. Continued use of the site after changes are posted constitutes your acceptance of the updated terms.'],
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
