export const getMessages = async (req, res) => {
  try {
    res.json([]);
  } catch (err) {
    res.status(500).json({ message: "Error fetching messages" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;

    res.json({
      message,
      createdAt: new Date(),
    });
  } catch (err) {
    res.status(500).json({ message: "Error sending message" });
  }
};
