namespace WatchTower.Shared.Models
{
    public enum ServerStatus
    {
        Running,
        Stopped,
        Degraded
    }

    public enum ServiceStatus
    {
        Running,
        Stopped,
        Down,
        Degraded
    }
}