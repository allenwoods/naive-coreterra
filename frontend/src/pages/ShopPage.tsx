import React from 'react';
import { useApp } from '@/context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { gamificationAPI } from '@/lib/api';
import { useState, useEffect } from 'react';
import type { ShopItem } from '@/types';

export const ShopPage: React.FC = () => {
  const { user, refreshUser } = useApp();
  const [shopItems, setShopItems] = useState<ShopItem[]>([]);

  useEffect(() => {
    gamificationAPI.getShopItems().then(setShopItems);
  }, []);

  const handleBuy = async (itemId: string, cost: number) => {
    if (user && user.gold >= cost) {
      try {
        await gamificationAPI.buyItem(itemId);
        await refreshUser();
        alert('Purchase successful!');
      } catch (error) {
        alert('Purchase failed!');
      }
    } else {
      alert('Not enough gold!');
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-background-light overflow-hidden">
      <div className="px-8 py-6 bg-surface-light border-b border-border-color flex justify-end items-center shrink-0">
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl px-6 py-3 flex items-center gap-4 shadow-sm">
          <div className="text-right">
            <p className="text-[10px] font-bold text-yellow-600 uppercase tracking-wider">Your Balance</p>
            <p className="text-2xl font-black text-slate-800">
              {user?.gold || 0} <span className="text-yellow-500 text-lg">G</span>
            </p>
          </div>
          <div className="size-10 rounded-full bg-yellow-400 flex items-center justify-center text-white shadow-lg shadow-yellow-400/50">
            <span className="material-symbols-outlined">monetization_on</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <section>
            <h3 className="text-lg font-bold text-text-main mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-blue-500">science</span>
              Consumables
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {shopItems
                .filter(item => item.type === 'consumable')
                .map(item => (
                  <Card key={item.id} className="hover:shadow-lg transition-all">
                    <CardContent className="p-5">
                      <div className="h-32 bg-slate-50 rounded-lg mb-4 flex items-center justify-center">
                        <span className="material-symbols-outlined text-6xl text-blue-400">shield</span>
                      </div>
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-slate-800">{item.name}</h4>
                        <span className="font-bold text-yellow-600 bg-yellow-50 px-2 py-1 rounded text-xs">
                          {item.cost} G
                        </span>
                      </div>
                      <p className="text-xs text-text-secondary mb-4 h-8">{item.name}</p>
                      <Button
                        onClick={() => handleBuy(item.id, item.cost)}
                        className="w-full"
                        variant="outline"
                        size="sm"
                      >
                        Purchase
                      </Button>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

