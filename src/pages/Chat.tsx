import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Send, Loader2, User, Store, ArrowLeft, MessageSquare, Clock } from 'lucide-react';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { 
  collection, 
  onSnapshot, 
  query, 
  where, 
  orderBy, 
  addDoc, 
  serverTimestamp, 
  doc, 
  getDoc, 
  updateDoc,
  setDoc,
  limit
} from 'firebase/firestore';
import { useFirebase } from '../context/FirebaseContext';

export const Chat: React.FC = () => {
  const { user, profile, sellerProfile: mySellerProfile } = useFirebase();
  const { chatId: urlChatId } = useParams<{ chatId: string }>();
  const [searchParams] = useSearchParams();
  const sellerId = searchParams.get('sellerId');
  const productId = searchParams.get('productId');
  
  const navigate = useNavigate();
  const [chats, setChats] = useState<any[]>([]);
  const [activeChat, setActiveChat] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Fetch all user chats
  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'chats'),
      where('participants', 'array-contains', user.uid),
      orderBy('lastMessageAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const chatsData = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      }));
      setChats(chatsData);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'chats');
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  // Handle initialization of a new chat or selection of existing
  useEffect(() => {
    if (!user || loading) return;

    const initChat = async () => {
      if (urlChatId) {
        const chatDoc = await getDoc(doc(db, 'chats', urlChatId));
        if (chatDoc.exists()) {
          setActiveChat({ ...chatDoc.data(), id: chatDoc.id });
        }
      } else if (sellerId && sellerId !== user.uid) {
        // Check if chat already exists between these two for this specific product
        const existingChat = chats.find(c => 
          c.participants.includes(user.uid) && 
          c.participants.includes(sellerId) &&
          (productId ? c.productId === productId : !c.productId)
        );

        if (existingChat) {
          navigate(`/chat/${existingChat.id}`);
        } else {
          // Fetch seller name for the new chat
          const sellerDoc = await getDoc(doc(db, 'sellers', sellerId));
          const sellerData = sellerDoc.data();
          
          // Fetch product info if exists
          let productInfo = null;
          if (productId) {
            const productDoc = await getDoc(doc(db, 'products', productId));
            if (productDoc.exists()) {
              productInfo = productDoc.data();
            }
          }
          
          // Create a temporary "new chat" state
          setActiveChat({
            id: 'new',
            participants: [user.uid, sellerId],
            sellerId: sellerId,
            sellerName: sellerData?.shopName || 'Cửa hàng',
            buyerId: user.uid,
            buyerName: profile?.displayName || 'Khách hàng',
            productId: productId || null,
            productName: productInfo?.name || null,
            productImage: productInfo?.image || null,
            isNew: true
          });
        }
      }
    };

    initChat();
  }, [urlChatId, sellerId, user, loading, chats, navigate]);

  // Fetch messages for active chat
  useEffect(() => {
    if (!activeChat?.id || activeChat.id === 'new') {
      setMessages([]);
      return;
    }

    const q = query(
      collection(db, 'chats', activeChat.id, 'messages'),
      orderBy('createdAt', 'asc'),
      limit(100)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messagesData = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      }));
      setMessages(messagesData);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, `chats/${activeChat.id}/messages`);
    });

    return () => unsubscribe();
  }, [activeChat?.id]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user || !activeChat || sending) return;

    setSending(true);
    try {
      let chatId = activeChat.id;

      // Create chat document if it's new
      if (activeChat.isNew) {
        const chatData = {
          participants: activeChat.participants,
          sellerId: activeChat.sellerId,
          sellerName: activeChat.sellerName,
          buyerId: activeChat.buyerId,
          buyerName: activeChat.buyerName,
          lastMessage: newMessage,
          lastMessageAt: new Date().toISOString(),
          productId: activeChat.productId || null,
          productName: activeChat.productName || null,
          productImage: activeChat.productImage || null
        };
        const chatRef = await addDoc(collection(db, 'chats'), chatData);
        chatId = chatRef.id;
        navigate(`/chat/${chatId}`);
      } else {
        // Update existing chat last message
        await updateDoc(doc(db, 'chats', chatId), {
          lastMessage: newMessage,
          lastMessageAt: new Date().toISOString()
        });
      }

      // Add message
      await addDoc(collection(db, 'chats', chatId, 'messages'), {
        chatId,
        senderId: user.uid,
        text: newMessage,
        createdAt: new Date().toISOString()
      });

      setNewMessage('');
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'chats/messages');
    } finally {
      setSending(false);
    }
  };

  if (!user) {
    return (
      <div className="pt-40 text-center px-8">
        <h2 className="serif text-3xl mb-4">Vui lòng đăng nhập</h2>
        <p className="text-on-surface-variant mb-8">Bạn cần đăng nhập để sử dụng tính năng trò chuyện.</p>
      </div>
    );
  }

  return (
    <main className="pt-32 pb-20 px-8 max-w-6xl mx-auto h-[calc(100vh-80px)] flex flex-col">
      <div className="flex-grow bg-surface-container rounded-3xl overflow-hidden border border-outline-variant/10 shadow-2xl flex">
        {/* Chat List Sidebar */}
        <aside className={`w-full md:w-80 border-r border-outline-variant/10 flex flex-col ${activeChat ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-6 border-b border-outline-variant/10">
            <h2 className="serif text-2xl">Trò chuyện</h2>
          </div>
          <div className="flex-grow overflow-y-auto custom-scrollbar">
            {loading ? (
              <div className="p-8 text-center">
                <Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" />
              </div>
            ) : chats.length === 0 ? (
              <div className="p-8 text-center text-on-surface-variant text-sm italic">
                Chưa có cuộc hội thoại nào.
              </div>
            ) : (
              chats.map(chat => (
                <button
                  key={chat.id}
                  onClick={() => navigate(`/chat/${chat.id}`)}
                  className={`w-full p-6 text-left hover:bg-surface-container-high transition-all flex gap-4 items-center ${activeChat?.id === chat.id ? 'bg-surface-container-highest' : ''}`}
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0 overflow-hidden">
                    {chat.sellerId === user.uid ? (
                      <User className="w-6 h-6 text-primary" />
                    ) : (
                      chat.productImage ? (
                        <img src={chat.productImage} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      ) : (
                        <Store className="w-6 h-6 text-primary" />
                      )
                    )}
                  </div>
                  <div className="flex-grow min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-bold text-sm truncate">
                        {chat.sellerId === user.uid ? (chat.buyerName || 'Khách hàng') : (chat.sellerName || 'Cửa hàng')}
                      </h4>
                      <span className="text-[10px] text-on-surface-variant whitespace-nowrap">
                        {new Date(chat.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    {chat.productName && (
                      <p className="text-[9px] text-primary font-bold uppercase tracking-widest mb-1 truncate">
                        Sản phẩm: {chat.productName}
                      </p>
                    )}
                    <p className="text-xs text-on-surface-variant truncate">{chat.lastMessage}</p>
                  </div>
                </button>
              ))
            )}
          </div>
        </aside>

        {/* Chat Window */}
        <section className={`flex-grow flex flex-col bg-surface-container-low ${!activeChat ? 'hidden md:flex' : 'flex'}`}>
          {activeChat ? (
            <>
              {/* Chat Header */}
              <header className="p-6 border-b border-outline-variant/10 flex items-center gap-4">
                <button 
                  onClick={() => navigate('/chat')}
                  className="md:hidden p-2 hover:bg-surface-container-high rounded-full transition-all"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center overflow-hidden">
                  {activeChat.sellerId === user.uid ? (
                    <User className="w-5 h-5 text-primary" />
                  ) : (
                    activeChat.productImage ? (
                      <img src={activeChat.productImage} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      <Store className="w-5 h-5 text-primary" />
                    )
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-on-surface">
                    {activeChat.sellerId === user.uid ? (activeChat.buyerName || 'Khách hàng') : (activeChat.sellerName || 'Cửa hàng')}
                  </h3>
                  <div className="flex items-center gap-2">
                    <p className="text-[10px] text-primary uppercase tracking-widest font-bold">Trực tuyến</p>
                    {activeChat.productName && (
                      <>
                        <span className="text-[10px] text-on-surface-variant">•</span>
                        <p className="text-[10px] text-on-surface-variant font-medium">Hỏi về: {activeChat.productName}</p>
                      </>
                    )}
                  </div>
                </div>
              </header>

              {/* Messages Area */}
              <div className="flex-grow overflow-y-auto p-6 space-y-4 custom-scrollbar">
                {messages.map((msg, idx) => {
                  const isMe = msg.senderId === user.uid;
                  return (
                    <motion.div
                      key={msg.id || idx}
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[80%] p-4 rounded-2xl shadow-sm ${isMe ? 'bg-primary text-on-primary rounded-tr-none' : 'bg-surface-container-highest text-on-surface rounded-tl-none'}`}>
                        <p className="text-sm leading-relaxed">{msg.text}</p>
                        <div className={`text-[9px] mt-2 opacity-60 flex items-center gap-1 ${isMe ? 'justify-end' : 'justify-start'}`}>
                          <Clock className="w-2 h-2" />
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <footer className="p-6 border-t border-outline-variant/10">
                <form onSubmit={sendMessage} className="flex gap-4">
                  <input 
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                    placeholder="Nhập tin nhắn..."
                    className="flex-grow bg-surface-container-high border border-outline-variant/20 rounded-full px-6 py-4 focus:border-primary transition-all outline-none text-sm"
                  />
                  <button 
                    disabled={!newMessage.trim() || sending}
                    className="w-14 h-14 bg-primary text-on-primary rounded-full flex items-center justify-center shadow-xl hover:brightness-110 active:scale-90 transition-all disabled:opacity-50"
                  >
                    {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                  </button>
                </form>
              </footer>
            </>
          ) : (
            <div className="flex-grow flex flex-col items-center justify-center text-center p-12">
              <div className="w-24 h-24 bg-surface-container-highest rounded-full flex items-center justify-center mb-6">
                <MessageSquare className="w-12 h-12 text-on-surface-variant/20" />
              </div>
              <h3 className="serif text-2xl text-on-surface mb-2">Chọn một cuộc trò chuyện</h3>
              <p className="text-on-surface-variant text-sm max-w-xs">
                Bắt đầu trao đổi với người mua hoặc người bán để tìm hiểu thêm về sản phẩm.
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
};
