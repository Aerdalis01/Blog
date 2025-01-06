export const register = async () => {
  const formData = new FormData();
  formData.append('email', 'newuser@example.com');
  formData.append('password', 'securepassword');

  try {
    const response = await fetch('/api/register', {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Message:', data.message);
    } else {
      const error = await response.json();
      console.error('Erreur:', error);
    }
  } catch (err) {
    console.error('Erreur réseau:', err);
  }
};

register();
