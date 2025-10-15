# Quick Start: WebSocket Testing

## 🚀 Getting Started (2 minutes)

### 1. Access the Test Page

```bash
# Make sure you're in development mode
npm run dev

# Navigate to:
http://localhost:3000/test-websocket
```

### 2. Quick Test (30 seconds)

1. **Check Connection Status** - Look at the top right corner
   - Green = Connected ✅
   - Red = Disconnected ❌

2. **Simulate an Event** - Click any button in the "Simulación" tab
   - Try "Voltaje" or "Potencia"
   - You'll see a toast notification

3. **View Logs** - Switch to "Logs" sub-tab
   - See the event you just simulated

## 🧪 Run Quick Tests (1 minute)

### Option 1: Automatic Simulation

1. Go to "Simulación" tab
2. Click "Automático" sub-tab
3. Click "Iniciar"
4. Watch events being generated automatically
5. Click "Detener" when done

### Option 2: Edge Case Tests

1. Go to "Edge Cases" tab
2. Click "Ejecutar Suite Completa"
3. Wait ~30 seconds
4. Check that all tests pass ✅

## 📊 View Metrics (30 seconds)

1. Go to "Métricas" tab
2. See:
   - Connection time
   - Events received/sent
   - Current latency
   - Connection history

## 🔍 Common Scenarios

### Test Reconnection

```
1. Go to "Edge Cases"
2. Click "Desconexión Temporal"
3. Watch the connection indicator
4. Verify it reconnects automatically
```

### Test with Slow Network

```
1. Go to "Edge Cases"
2. Click "Activar Red Lenta"
3. Try simulating events
4. Notice the delay
5. Click "Desactivar Red Lenta"
```

### Check Memory Usage

```
1. Go to "Edge Cases"
2. Click "Uso de Memoria"
3. See current memory usage
4. Run automatic simulation for 5 minutes
5. Check memory again (should be stable)
```

## ⚠️ Troubleshooting

### "Not Connected" Error

**Problem**: Can't simulate events
**Solution**: 
1. Check you're logged in
2. Verify WebSocket server is running (port 5000)
3. Check console for errors

### Page Not Found

**Problem**: `/test-websocket` returns 404
**Solution**: Make sure `NODE_ENV=development`

### Events Not Showing

**Problem**: Simulated events don't appear
**Solution**:
1. Check "Logs" tab
2. Verify connection status
3. Open browser console for errors

## 💡 Pro Tips

1. **Keep it open** - Leave the test page open while developing
2. **Monitor metrics** - Watch for unusual patterns
3. **Test before deploy** - Run the full suite before each deployment
4. **Check console** - Always verify no errors in browser console
5. **Multiple tabs** - Test with 2-3 tabs open simultaneously

## 📝 Quick Checklist

Before deploying:
- [ ] Run "Ejecutar Suite Completa"
- [ ] All tests pass
- [ ] No console errors
- [ ] Latency <200ms
- [ ] Memory usage stable
- [ ] Reconnection works

## 🎯 Next Steps

For detailed information, see:
- `TEST_MODE_README.md` - Complete documentation
- `TASK_14_IMPLEMENTATION_SUMMARY.md` - Implementation details

## 🆘 Need Help?

Common issues and solutions:

| Issue | Solution |
|-------|----------|
| Can't connect | Check token, verify server running |
| High latency | Check network, disable "Red Lenta" |
| Memory growing | Check for listener leaks |
| Tests failing | Check console, verify server status |

---

**Remember**: This is a development tool. It won't be available in production! 🔒
